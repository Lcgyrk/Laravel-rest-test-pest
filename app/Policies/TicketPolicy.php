<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'agent']);
    }

    public function view(User $user, Ticket $ticket): bool
    {
        if (in_array($user->role, ['admin', 'agent'])) {
            return true;
        }
        return $user->id === $ticket->user_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['customer', 'admin']);
    }

    public function update(User $user, Ticket $ticket): bool
    {
        if ($user->role === 'admin') {
            return true;
        }
        if ($user->role === 'agent') {
            return true;
        }
        return $user->id === $ticket->user_id;
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Ticket $ticket): bool
    {
        return false;
    }

    public function forceDelete(User $user, Ticket $ticket): bool
    {
        return false;
    }
}
