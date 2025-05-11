<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChangeLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'news_id',
        'action',
        'action_date',
    ];

    protected $dates = ['action_date'];
}
