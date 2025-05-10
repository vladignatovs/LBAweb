<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('friendships', function (Blueprint $table) {
            $table->unsignedBigInteger('friend_id');
            $table->unsignedBigInteger('friended_id');

            $table->primary(['friend_id', 'friended_id']);

            $table->foreign('friend_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
            $table->foreign('friended_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('friendships');
    }
};
