<?php
namespace App\Http\Controllers\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller {
    /**
     * Logs in user by validating request credentials, attempts to authenticate using said credentials
     * and returns session token along with user model
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function login(Request $request) {
        \Log::info('Login request received', $request->all());

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        \Log::info('Credentials validated');

        if (!Auth::attempt($credentials)) {
            \Log::error('Invalid credentials');
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = User::where('email', $request->email)->first();
        \Log::info('User found', [$user]);

        $token = $user->createToken('auth_token')->plainTextToken;
        \Log::info('Token generated');

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }
    /**
     * Registers user by validating input data, creaing user model and returning user model with session token
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        // Validate the request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create the user
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        // Generate a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the token and user data
        return response()->json([
            'token' => $token,
            'user' => $user,
        ], 201);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Logs out all the users from the system and the database (i think)
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function forceLogout(Request $request){
        // If unauthorized or no admin rights -> return eror 403
        if (!Auth::check() || Auth::user()->rights !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        // Delete all tokens
        $request->user()->tokens->each(function ($token) {
            $token->delete();
        });

        return response()->json(['message' => 'All sessions logged out']);
    }

    public function user(Request $request) {
        return $request->user();
    }
}
