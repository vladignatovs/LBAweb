<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CompletionController extends Controller
{
    public function index()
    {
        // show my completions
        return Auth::user()->completedLevels()->get();
    }

    public function show($levelId)
    {
        // show whether I’ve completed a specific level
        return Auth::user()
                   ->completedLevels()
                   ->where('level_id',$levelId)
                   ->exists();
    }
}
