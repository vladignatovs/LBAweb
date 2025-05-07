<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class FriendshipController extends Controller
{
    /**
     * List all friends of the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $friends = $user->friends()->get(['users.id','users.name','users.email']);

        return response()->json($friends);
    }

    /**
     * Remove a friend relationship.
     *
     * @param  int  $friendId
     */
    public function destroy(Request $request, $friendId)
    {
        $user = $request->user();
        $other = User::findOrFail($friendId);

        // Detach A → B
        $user->friends()->detach($friendId);

        // Detach B → A
        $other->friends()->detach($user->id);

        return response()->json(null, 204);
    }
}
