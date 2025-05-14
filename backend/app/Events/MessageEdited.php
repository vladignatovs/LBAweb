<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class MessageEdited implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Message $message;
    public string $oldText;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message, string $oldText)
    {
        $this->message = $message;
        $this->oldText = $oldText;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel[]
     */
    public function broadcastOn(): array
    {
        $ids = [$this->message->sender_id, $this->message->receiver_id];
        sort($ids);
        $conversation = implode('-', $ids);

        return [
            new PrivateChannel('chat.' . $this->message->receiver_id),
            new PrivateChannel('chat.' . $conversation),
        ];
    }

    /**
     * The data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id'           => $this->message->id,
            'sender_id'    => $this->message->sender_id,
            'old_text'     => $this->oldText,
            'new_text'     => $this->message->message_text,
            'edited_at'    => now()->toDateTimeString(),
        ];
    }
}
