<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CompletionController extends Controller
{
    // shows all completed levels
    public function index()
    {
        return Auth::user()->completedLevels()->get();
    }

    // shows whether given level is completed
    public function show($levelId)
    {
        return Auth::user()
                   ->completedLevels()
                   ->where('level_id',$levelId)
                   ->exists();
    }
}
