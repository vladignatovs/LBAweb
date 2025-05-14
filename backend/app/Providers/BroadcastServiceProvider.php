<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot()
    {
        Broadcast::routes([
            'prefix' => 'api/',
            'middleware' => ['api','auth:sanctum'],
        ]);

        require base_path('/routes/channels.php');
    }
}
