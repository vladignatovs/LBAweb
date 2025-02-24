<?php

use App\Http\Middleware\AdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\NewsController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/message', function() {
    return response() -> json(['message' => 'Hello from Laravel backend!']);
});

# testing REDIS service
use Illuminate\Support\Facades\Redis;

Route::get('/redis-test', function () {
    Redis::set('test-key', 'Hello from Redis!');
    return Redis::get('test-key');
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/register', [AuthController::class, 'register']);
// checks for authentication token first, then authcontroller user method which just returns user (could just check for localstorage from frontend (?))
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
// TODO: TEST, MAKE SURE TO CHANGE THIS LATER, SHOULDN'T HAVE SEPARATED LINKS (maybe)
Route::get('/news', [NewsController::class, 'index']);  // get all news
Route::get('/news/{id}', [NewsController::class, 'show']);  // get single news

// STORE FUNCTION ONLY AVAILABLE FOR ADMINS
Route::post('/news', [NewsController::class, 'store'])->middleware(['auth:sanctum']);
