<?php

use App\Http\Controllers\FriendshipController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\FriendRequestController;
use App\Http\Controllers\BlockController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\CompletionController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Public / Auth Routes
|--------------------------------------------------------------------------
*/

// testing REDIS service
use Illuminate\Support\Facades\Redis;

Route::get('/redis-test', function () {
    Redis::set('test-key', 'Hello from Redis!');
    return Redis::get('test-key');
});

// user authentication
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// TODO: TEST, MAKE SURE TO CHANGE THIS LATER, SHOULDN'T HAVE SEPARATED LINKS (maybe)
// public news access
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected Routes (require auth:sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // user info & logout
    // checks for authentication token first, then authcontroller user method which just returns user (could just check for localstorage from frontend (?))
    Route::get('/user',  [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // STORE FUNCTION ONLY AVAILABLE FOR ADMINS
    Route::post('/news', [NewsController::class, 'store']);

    // Friend-requests: index (incoming), store (send), update (accept/deny), destroy (cancel)
    Route::apiResource('friend-requests', FriendRequestController::class)
         ->only(['index','store','update','destroy']);

    // Blocks: index (my blocks), store (block), destroy (unblock)
    Route::apiResource('blocks', BlockController::class)
         ->only(['index','store','destroy']);

    // Messages: full CRUD (only between friends)
    Route::apiResource('messages', MessageController::class);

    // |-------------------------------------------
    // MIGHT WANT TO MAKE THEM PUBLIC
    // List/search users
    Route::get('/users', [UserController::class, 'index']);
    // Levels: read-only
    Route::apiResource('levels', LevelController::class)
         ->only(['index','show']);
    // |-------------------------------------------
    // Friendships: read and delete
    Route::apiResource('friendships', FriendshipController::class);

    // Completions: read-only (user’s own)
    Route::apiResource('completions', CompletionController::class)
         ->only(['index','show']);
});
