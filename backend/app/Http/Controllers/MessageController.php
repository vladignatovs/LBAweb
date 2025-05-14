<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;
use App\Events\MessageEdited;
use App\Events\MessageDeleted;

class MessageController extends Controller
{
    public function index()
    {
        $friendId = request('with');

        $friends = Auth::user()->friends();

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
        $message = Message::create($data);

        broadcast(new MessageSent($message))->toOthers();
        // broadcast(new MessageSent($msg));

        return response()->json($message, 201);
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

        $data = $request->validate([
            'message_text' => 'required|string',
        ]);

        $oldText = $message->message_text;
        $message->update($data);

        broadcast(new MessageEdited($message, $oldText))->toOthers();

        return $message;
    }

    public function destroy(Message $message)
    {
        abort_unless($message->sender_id === Auth::id(), 403);

        broadcast(new MessageDeleted($message))->toOthers();

        $message->delete();

        return response()->noContent();
    }
}
