<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Level;
use App\Models\User;

class BrowseController extends Controller
{
    /**
     * Optional ?q= to search by name.
     */
    public function index(Request $request)
    {
        $search = $request->query('q', '');

        $users = User::when($search, function ($qry) use ($search) {
                $qry->where('name', 'like', "%{$search}%");
            })->select(['id', 'name', 'email'])->get();

        $levels = Level::when($search, function($query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        })->select(['id','name','creator_name', 'created_at'])->get();

        return response()->json([
            'levels' => $levels,
            'users'  => $users,
        ]);
    }
}
