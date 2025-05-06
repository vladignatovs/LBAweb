<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Level;

class LevelController extends Controller
{
    public function index()
    {
        return Level::all();
    }

    public function show(Level $level)
    {
        return $level;
    }
}
