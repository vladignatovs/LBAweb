<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FriendRequestController extends Controller
{
    public function index()
    {
        // show incoming requests
        return Auth::user()
                   ->friendRequestsReceived()
                   ->with('sender:id,name')
                   ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id|not_in:'.Auth::id()
        ]);

        // make sure we don’t resend an existing request or friendship
        if (FriendRequest::where($data)->exists() ||
            Auth::user()->friends()->where('friended_id', $data['receiver_id'])->exists()) {
            return response()->json(['message'=>'Already requested or friends'], 422);
        }

        $data['sender_id'] = Auth::id();
        $fr = FriendRequest::create($data);

        return response()->json($fr, 201);
    }

    public function update(Request $request, FriendRequest $friendRequest)
    {
        // only the receiver may accept/deny
        abort_unless($friendRequest->receiver_id === Auth::id(), 403);

        $data = $request->validate([
            'status' => 'required|boolean'
        ]);

        $friendRequest->update($data);

        if ($data['status']) {
            // create friendship both ways
            Auth::user()->friends()->attach($friendRequest->sender_id);
            User::findOrFail($friendRequest->sender_id)
                ->friends()->attach(Auth::id());
        }

        return response()->json($friendRequest);
    }

    public function destroy(FriendRequest $friendRequest)
    {
        // only sender may cancel
        abort_unless($friendRequest->sender_id === Auth::id(), 403);
        $friendRequest->delete();
        return response()->noContent();
    }
}
