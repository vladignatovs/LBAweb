<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\FriendshipService;
use App\Models\User;

class FriendshipController extends Controller
{
    /**
     * List all friends of the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $friends = $user->friends();
        return response()->json($friends);
    }

    /**
     * Create a two‐way friendship.
     */
    public function store(Request $request, FriendshipService $service)
    {
        $data = $request->validate([
            'friend_id' => 'required|exists:users,id|not_in:' . Auth::id(),
        ]);

        $service->befriend(
            Auth::user(),
            User::findOrFail((int) $data['friend_id'])
        );

        return response()->json(null, 201);
    }


    /**
     * Remove a friend relationship.
     */
    public function destroy(User $friendship, FriendshipService $service)
    {
        // $friendship actually points to the friend, not the whole friendship
        $service->unfriend(
            Auth::user(),
            $friendship
        );

        return response()->noContent();
    }
}
