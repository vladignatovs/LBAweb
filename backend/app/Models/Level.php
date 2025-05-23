<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $fillable = ['name','creator_id','creator_name'];

    public function creator()
    {
        return $this->belongsTo(User::class,'creator_id');
    }
}
