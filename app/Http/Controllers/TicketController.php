<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TicketController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin' || $user->role === 'agent') {
            $tickets = Ticket::with('user')->get();
        } else {
            $tickets = Ticket::where('user_id', $user->id)->with('user')->get();
        }

        return response()->json([
            'message' => 'Tickets retrieved successfully',
            'tickets' => $tickets,
        ], 200);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Ticket::class);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();

        $ticket = Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'open',
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Ticket created successfully',
            'ticket' => $ticket->load('user'),
        ], 201);
    }

    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        return response()->json([
            'message' => 'Ticket retrieved successfully',
            'ticket' => $ticket->load('user'),
        ], 200);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);

        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|string|in:open,in_progress,resolved,closed',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|min:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($user->role === 'customer') {
            if ($request->has('status') && $request->status !== 'closed') {
                return response()->json([
                    'message' => 'Customers can only close tickets',
                ], 403);
            }
        }

        $ticket->update($request->only(['title', 'description', 'status']));

        return response()->json([
            'message' => 'Ticket updated successfully',
            'ticket' => $ticket->load('user'),
        ], 200);
    }

    public function destroy(Ticket $ticket)
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully',
        ], 200);
    }
}
