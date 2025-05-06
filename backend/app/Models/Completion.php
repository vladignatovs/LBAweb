<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Completion extends Pivot
{
    protected $table = 'completions';
    public $incrementing = false;
}
