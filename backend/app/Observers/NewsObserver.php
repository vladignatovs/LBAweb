<?php

namespace App\Observers;

use App\Models\News;
use App\Models\ChangeLog;
use Illuminate\Support\Facades\Auth;

class NewsObserver
{
    /**
     * Handle the News "created" event.
     */
    public function created(News $news): void
    {
        ChangeLog::create([
            'admin_id'     => Auth::id(),
            'news_id'      => $news->id,
            'action'    => 'CREATE',
            'action_date'  => now(),
        ]);
    }

    /**
     * Handle the News "updated" event.
     */
    public function updated(News $news): void
    {
        ChangeLog::create([
            'admin_id'     => Auth::id(),
            'news_id'      => $news->id,
            'action'    => 'UPDATE',
            'action_date'  => now(),
        ]);
    }

    /**
     * Handle the News "deleted" event.
     */
    public function deleted(News $news): void
    {
        // terminated since by that time news object is already deleted, and there is nothing to log
        // also deleting news deletes other logs
        // ChangeLog::create([
        //     'admin_id'     => Auth::id(),
        //     'news_id'      => $news->id,
        //     'action'    => 'DELETE',
        //     'action_date'  => now(),
        // ]);
    }

    /**
     * Handle the News "restored" event.
     */
    public function restored(News $news): void
    {
        //
    }

    /**
     * Handle the News "force deleted" event.
     */
    public function forceDeleted(News $news): void
    {
        //
    }
}
