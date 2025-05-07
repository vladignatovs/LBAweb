<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Friendship extends Pivot
{
    // Pivot tables by default don’t have auto-incrementing keys
    public $incrementing = false;

    // We don’t maintain timestamps on this pivot
    public $timestamps = false;

    // Explicitly declare the table name
    protected $table = 'friendships';

    // Allow mass assignment on both foreign keys
    protected $fillable = [
        'friend_id',
        'friended_id',
    ];
}
