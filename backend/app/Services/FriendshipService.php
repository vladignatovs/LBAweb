<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\User;

class FriendshipService
{
    public function befriend(User $a, User $b)
    {
        // 1) sort so friend_id < friended_id
        [$first, $second] = $a->id < $b->id
            ? [$a->id, $b->id]
            : [$b->id, $a->id];

        // 2) insert one row if it doesn’t exist
        DB::table('friendships')
          ->insertOrIgnore([
             'friend_id'   => $first,
             'friended_id' => $second,
          ]);
    }

    public function unfriend(User $a, User $b)
    {
        [$first, $second] = $a->id < $b->id
            ? [$a->id, $b->id]
            : [$b->id, $a->id];

        DB::table('friendships')
          ->where('friend_id',   $first)
          ->where('friended_id', $second)
          ->delete();
    }
}
