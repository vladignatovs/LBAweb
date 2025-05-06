<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = ['creator_id','creator_username'];

    public function creator()
    {
        return $this->belongsTo(User::class,'creator_id');
    }
}
