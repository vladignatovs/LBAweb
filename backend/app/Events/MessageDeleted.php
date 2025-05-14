<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class MessageDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $messageId;
    public int $senderId;
    public int $receiverId;

    /**
     * Create a new event instance.
     */
    public function __construct(Message $message)
    {
        // After deletion the model is soft-deleted or gone,
        // so capture only the IDs you need up front.
        $this->messageId  = $message->id;
        $this->senderId   = $message->sender_id;
        $this->receiverId = $message->receiver_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel[]
     */
    public function broadcastOn(): array
    {
        $ids = [$this->senderId, $this->receiverId];
        sort($ids);
        $conversation = implode('-', $ids);

        return [
            new PrivateChannel('chat.' . $this->receiverId),
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
            'id'         => $this->messageId,
            'sender_id'  => $this->senderId,
            'deleted_at' => now()->toDateTimeString(),
        ];
    }
}
