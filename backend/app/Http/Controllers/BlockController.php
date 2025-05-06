<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Block;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlockController extends Controller
{
    public function index()
    {
        return Auth::user()
                   ->blocks()
                   ->withPivot('blocked_id')
                   ->get(['users.id','users.username']);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'blocked_id' => 'required|exists:users,id|not_in:'.Auth::id()
        ]);

        Auth::user()->blocks()->attach($data['blocked_id']);

        return response()->json(['message'=>'User blocked'], 201);
    }

    public function destroy($blocked_id)
    {
        Auth::user()->blocks()->detach($blocked_id);
        return response()->noContent();
    }
}
