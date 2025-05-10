<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FriendRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\FriendshipService;

class FriendRequestController extends Controller
{
    /**
     * Show all incoming requests that have been responded to.
     */
    public function index()
    {
        return Auth::user()
            ->friendRequestsReceived()
            ->with('sender:id,name')
            ->whereNotNull('status')
            ->get();
    }

    /**
     * Show all incoming requests that are still pending.
     */
    public function pending()
    {
        return Auth::user()
            ->friendRequestsReceived()
            ->with('sender:id,name')
            ->whereNull('status')
            ->get();
    }

    /**
     * Show all outgoing requests (that I’ve sent).
     */
    public function sent()
    {
        return Auth::user()
            ->friendRequestsSent()
            ->with('receiver:id,name,email')
            ->whereNull('status')
            ->get();
    }

    /**
     * Send a new friend request.
     * Checks for:
     * 1. Whether sender was blocked by reciever.
     * 2. Whether sender has already sent a friend request that is still unanswered.
     * 3. Whether sender and reciever are already friends.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id|not_in:'.Auth::id(),
        ]);

        $meId = Auth::id();
        $receiverId = $data['receiver_id'];

        // 1) Block check
        $hasBlocked = DB::table('blocks')
            ->where('blocker_id', $receiverId)
            ->where('blocked_id', $meId)
            ->exists();

        if ($hasBlocked) {
            return response()->json([
                'message' => 'You cannot send a friend request to this user.'
            ], 403);
        }

        // 2) Pending request check
        $alreadyPending = FriendRequest::where('sender_id', $meId)
            ->where('receiver_id', $receiverId)
            ->whereNull('status')
            ->exists();

        if ($alreadyPending) {
            return response()->json([
                'message' => 'You already have a pending friend request to this user.'
            ], 422);
        }

        // 3) Friendship existence check
        $alreadyFriends = Auth::user()
            ->friends()
            ->contains('id', $receiverId);

        if ($alreadyFriends) {
            return response()->json([
                'message' => 'You are already friends with this user.'
            ], 422);
        }

        // 4) Create the request
        $data['sender_id'] = $meId;
        $fr = FriendRequest::create($data);

        return response()->json($fr, 201);
    }


    /**
     * Accept or deny an incoming request.
     */
    public function update(Request $request, FriendRequest $friendRequest, FriendshipService $service)
    {
        // only the receiver may accept/deny
        abort_unless($friendRequest->receiver_id === Auth::id(), 403);

        $data = $request->validate([
            'status' => 'required|boolean'
        ]);

        $friendRequest->update($data);


        if ($data['status']) {
            $me = Auth::user();
            $sender = $friendRequest->sender()->firstOrFail();
            $service->befriend($me, $sender);
        }

        return response()->json($friendRequest);
    }

    /**
     * Cancel an outgoing request.
     */
    public function destroy(FriendRequest $friendRequest)
    {
        // only sender may cancel
        abort_unless($friendRequest->sender_id === Auth::id(), 403);

        $friendRequest->delete();
        return response()->noContent();
    }
}
