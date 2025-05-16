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

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function news()
    {
        return $this->belongsTo(News::class, 'news_id');
    }
}
