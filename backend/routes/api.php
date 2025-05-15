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
use App\Http\Controllers\BrowseController;

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

// public news access
Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Protected Routes (require auth:sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Route::get('/user',  [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user/relationships', [UserController::class, 'relationships']);
    Route::get('/user/created-levels', [UserController::class, 'createdLevels']);


    Route::patch('/user/name', [UserController::class, 'updateName']);
    Route::patch('/user/email', [UserController::class, 'updateEmail']);
    Route::patch('/user/password', [UserController::class, 'updatePassword']);
    Route::delete('/user', [UserController::class, 'destroy']);

    // uselesss show
    Route::apiResource('completions', CompletionController::class)->only(['index','show']);

    Route::get('/browse', [BrowseController::class, 'index']);

    // useless index
    Route::apiResource('friend-requests', FriendRequestController::class)->only(['index','store','update','destroy']);

    // Route::get('friend-requests/pending', [FriendRequestController::class, 'pending']);
    // Route::get('friend-requests/sent', [FriendRequestController::class, 'sent']);

    // useless index
    Route::apiResource('blocks', BlockController::class)->only(['index','store','destroy']);

    Route::apiResource('messages', MessageController::class);

    // Route::get('/users', [UserController::class, 'index']);
    // Route::apiResource('levels', LevelController::class)->only(['index','show']);

    // useless index, store
    Route::apiResource('friendships', FriendshipController::class)->only(['index','store','destroy']);;

    // FUNCTIONS ONLY AVAILABLE FOR ADMINS
    // TODO: MAKE PROPER ADMIN MIDDLEWARE
    Route::apiResource('news', NewsController::class)->only(['store', 'update', 'destroy']);
});
