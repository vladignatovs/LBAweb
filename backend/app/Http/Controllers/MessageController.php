<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
public function index()
{
    $friendId = request('with');

    $friends = Auth::user()->friends();  // Collection

    abort_unless(
        $friends->contains('id', $friendId),
        403
    );

    return Message::where(function($q) use($friendId){
        $q->where('sender_id',Auth::id())
            ->where('receiver_id',$friendId);
    })->orWhere(function($q) use($friendId){
        $q->where('sender_id',$friendId)
            ->where('receiver_id',Auth::id());
    })->get();
}
    public function store(Request $request)
    {
        $data = $request->validate([
            'receiver_id'=>'required|exists:users,id',
            'message_text'=>'required|string'
        ]);

        // only friends can message
        abort_unless(
            Auth::user()->friends()->contains('id',$data['receiver_id']),
            403
        );

        $data['sender_id'] = Auth::id();
        $msg = Message::create($data);

        return response()->json($msg, 201);
    }

    public function show(Message $message)
    {
        abort_unless(
            $message->sender_id === Auth::id() ||
            $message->receiver_id === Auth::id(),
            403
        );
        return $message;
    }

    public function update(Request $request, Message $message)
    {
        abort_unless($message->sender_id === Auth::id(), 403);
        $data = $request->validate(['message_text'=>'required|string']);
        $message->update($data);
        return $message;
    }

    public function destroy(Message $message)
    {
        abort_unless($message->sender_id === Auth::id(), 403);
        $message->delete();
        return response()->noContent();
    }
}
