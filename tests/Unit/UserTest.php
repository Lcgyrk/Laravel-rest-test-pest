<?php

use App\Models\Ticket;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('customer can only update their own ticket', function () {
    // Create two customers
    $customer1 = User::factory()->create(['role' => 'customer']);
    $customer2 = User::factory()->create(['role' => 'customer']);

    // Customer 1 creates a ticket
    $ticket = Ticket::factory()->create([
        'user_id' => $customer1->id,
        'title' => 'Original Title',
        'description' => 'Original Description',
        'status' => 'open',
    ]);

    // Authenticate as customer 2 (trying to update customer 1's ticket)
    Sanctum::actingAs($customer2);

    // Attempt to update customer 1's ticket
    $response = $this->putJson("/api/tickets/{$ticket->id}", [
        'title' => 'Updated Title',
        'description' => 'Updated Description',
        'status' => 'in_progress',
    ]);

    // Should be forbidden
    $response->assertStatus(403);

    // Verify the ticket was NOT updated
    $ticket->refresh();
    expect($ticket->title)->toBe('Original Title');
    expect($ticket->description)->toBe('Original Description');
    expect($ticket->status)->toBe('open');

    // Now authenticate as customer 1 (the owner)
    Sanctum::actingAs($customer1);

    // Attempt to update their own ticket (customers can only close tickets for status)
    $response = $this->putJson("/api/tickets/{$ticket->id}", [
        'title' => 'Updated Title',
        'description' => 'Updated Description',
        'status' => 'closed',
    ]);

    // Should be successful
    $response->assertStatus(200);

    // Verify the ticket WAS updated
    $ticket->refresh();
    expect($ticket->title)->toBe('Updated Title');
    expect($ticket->description)->toBe('Updated Description');
    expect($ticket->status)->toBe('closed');
});

test('agent can update any ticket status', function () {
    // Create a customer and their ticket
    $customer = User::factory()->create(['role' => 'customer']);
    $ticket = Ticket::factory()->create([
        'user_id' => $customer->id,
        'title' => 'Original Title',
        'description' => 'Original Description',
        'status' => 'open',
    ]);

    // Create an agent
    $agent = User::factory()->create(['role' => 'agent']);

    // Authenticate as agent
    Sanctum::actingAs($agent);

    // Agent updates the customer's ticket status to in_progress
    $response = $this->putJson("/api/tickets/{$ticket->id}", [
        'title' => 'Agent Updated Title',
        'description' => 'Agent Updated Description',
        'status' => 'in_progress',
    ]);

    // Should be successful
    $response->assertStatus(200);

    // Verify the ticket WAS updated
    $ticket->refresh();
    expect($ticket->title)->toBe('Agent Updated Title');
    expect($ticket->description)->toBe('Agent Updated Description');
    expect($ticket->status)->toBe('in_progress');

    // Agent updates the ticket to resolved
    $response = $this->putJson("/api/tickets/{$ticket->id}", [
        'status' => 'resolved',
    ]);

    $response->assertStatus(200);
    $ticket->refresh();
    expect($ticket->status)->toBe('resolved');

    // Agent updates the ticket to closed
    $response = $this->putJson("/api/tickets/{$ticket->id}", [
        'status' => 'closed',
    ]);

    $response->assertStatus(200);
    $ticket->refresh();
    expect($ticket->status)->toBe('closed');
});

