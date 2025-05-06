<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Block extends Pivot
{
    protected $table = 'blocks';
    public $incrementing = false;
    protected $fillable = ['blocker_id','blocked_id'];
}
