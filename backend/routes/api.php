<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

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
