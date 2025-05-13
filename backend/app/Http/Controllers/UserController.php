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

    public function relationships(Request $request)
    {
        $user = $request->user()->load([
            'friendsRelation',
            'friendsRelationInverse',
            'blocks',
            'friendRequestsReceived.sender',
            'friendRequestsSent.receiver',
        ]);

        $friends = $user->friendsRelation
            ->merge($user->friendsRelationInverse)
            ->unique('id')
            ->values();

        return response()->json([
            'user'    => $user->only(['id', 'name', 'email', 'rights']),
            'friends' => $friends,
            'blocked' => $user->blocks,
            'pending' => $user->friendRequestsReceived,
            'sent'    => $user->friendRequestsSent,
        ]);
    }
}
