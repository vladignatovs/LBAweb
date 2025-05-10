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
        Schema::table('friendships', function (Blueprint $table) {
            DB::statement('ALTER TABLE friendships ADD CONSTRAINT check_order CHECK (friend_id < friended_id)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('friendships', function (Blueprint $table) {
            DB::statement('ALTER TABLE friendships DROP CONSTRAINT check_order');
        });
    }
};
