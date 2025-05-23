<?php

namespace App\Models;
use Laravel\Sanctum\HasApiTokens;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    use HasApiTokens;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'rights'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    // friend requests I’ve sent
    public function friendRequestsSent()
    {
        return $this->hasMany(FriendRequest::class, 'sender_id')
            ->whereNull('status')
            ->with('receiver:id,name,email');
    }

    // friend requests I’ve received
    public function friendRequestsReceived()
    {
        return $this->hasMany(FriendRequest::class, 'receiver_id')
            ->whereNull('status')
            ->with('sender:id,name');
    }

    // my friends (bidirectional pivot)
    public function friends()
    {
        $firstCol = $this->belongsToMany(User::class, 'friendships', 'friend_id', 'friended_id')->get();
        $secondCol = $this->belongsToMany(User::class, 'friendships', 'friended_id', 'friend_id')->get();

        return $firstCol->merge($secondCol)->unique('id')->values();
    }

    public function friendsRelation()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'friended_id',
            'friend_id'
        );
    }

    public function friendsRelationInverse()
    {
        return $this->belongsToMany(
            User::class,
            'friendships',
            'friend_id',
            'friended_id'
        );
    }

    // blocks I’ve made
    public function blocks()
    {
        return $this->belongsToMany(
            User::class,
            'blocks',
            'blocker_id',
            'blocked_id'
        );
    }

    // messages I’ve sent
    public function messagesSent()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // messages I’ve received
    public function messagesReceived()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    // levels I completed
    public function completedLevels()
    {
        return $this->belongsToMany(Level::class, 'completions');
    }

    // created levels
    public function createdLevels()
    {
        return $this->hasMany(Level::class, 'creator_id');
    }
}
