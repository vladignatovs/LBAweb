<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Optional ?q= parameter to search by name.
     */
    public function index(Request $request)
    {
        $search = $request->query('q', '');

        $users = User::when($search, function ($qry) use ($search) {
                $qry->where('name', 'like', "%{$search}%");
            })
            ->select(['id','name','email'])
            ->get();

        return response()->json($users);
    }
}
