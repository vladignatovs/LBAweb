<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ChangeLog;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        $all = User::select('id','name','email','rights')->get();

        $grouped = $all->groupBy('rights');

        return response()->json($grouped);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8',
        ]);

        foreach ($data as $field => $newValue) {
            if ($field === 'password') {
                $user->password = Hash::make($newValue);
            } else {
                $user->$field = $newValue;
            }
        }

        $user->save();

        return response()->json($user->only(['id','name','email','rights']));
    }

    public function destroy(User $user)
    {
        $user->tokens()->delete();

        $user->delete();

        return response()->noContent();
    }

    public function terminateSessions()
    {
        PersonalAccessToken::query()->delete();
        return response()->json([
            'message' => 'All sessions have been terminated.'
        ]);
    }

    public function changeLogs()
    {
        $logs = ChangeLog::with(['admin:id,name','news:id,title'])
            ->orderBy('action_date','desc')
            ->get();

        return response()->json($logs);
    }
}
