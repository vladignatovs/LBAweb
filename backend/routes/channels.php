<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('chat.{conversation}', function ($user, $conversation) {
    \Log::info("Authorizing chat.$conversation for user {$user->id}");
    [$id1, $id2] = explode('-', $conversation);

    // Authorize only if the current user is one of the two participants
    \Log::info("Testing the result: " . in_array((int) $user->id, [(int) $id1, (int) $id2]));
    return in_array((int) $user->id, [(int) $id1, (int) $id2]);
});

// Broadcast::channel('chat.{friendId}', function ($user, $friendId) {
//     \Log::info("func result" . $user->friends()->pluck('id')->contains($friendId));
//     return $user->friends()->pluck('id')->contains($friendId);
// });

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

