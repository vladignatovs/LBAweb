<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Validation\ValidationException;
use Hash;
use Illuminate\Http\Request;


class UserController extends Controller
{
    /**
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

    public function updateName(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $user->update([
            'name' => $data['name'],
        ]);

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email'=> $user->email,
        ]);
    }

    public function updateEmail(Request $request)
    {
        // must provide email to change to, as well as current password to check
        $data = $request->validate([
            'email' => 'required|email|unique:users,email',
            'current_password' => 'required',
        ]);

        $user = $request->user();

        // check if hashed password value matches the one in the database, if it doesnt, throws a message
        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password does not match our records.'],
            ]);
        }

        $user->update([
            'email' => $data['email'],
        ]);;

        return response()->json(['email' => $user->email]);
    }

    public function updatePassword(Request $request)
    {
        // must provide new password to change to, as well as current password to check
        $data = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        // check if hashed password value matches the one in the database, if it doesnt, throws a message
        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password does not match our records.'],
            ]);
        }

        // password will automatically get hashed
        $user->update([
            'password' => $data['new_password'],
        ]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function destroy(Request $request)
    {
        // delete tokens, then delete user object
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();

        return response()->noContent();
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
            'user' => $user->only(['id', 'name', 'email', 'rights']),
            'friends' => $friends,
            'blocked' => $user->blocks,
            'pending' => $user->friendRequestsReceived,
            'sent' => $user->friendRequestsSent,
        ]);
    }

    public function createdLevels(Request $request)
    {
        return $request->user()->createdLevels()->get();
    }
}
