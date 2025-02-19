<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

//will act as an api for vue.js to send requests to and get the data responses (from db ig)
Route::get('/message', function() {
    return response() -> json(['message' => 'Hello from Laravel backend!']);
});
