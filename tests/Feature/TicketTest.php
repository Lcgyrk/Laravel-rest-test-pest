<?php

use Tests\TestCase;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(TestCase::class, RefreshDatabase::class);

it('has ticket page', function () {
    $response = $this->get('/tickets');

    $response->assertStatus(200);
});

test('customer can only see their own tickets', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $other = User::factory()->create(['role' => 'customer']);

    Ticket::factory()->create([
        'user_id' => $customer->id,
        'title' => 'Customer Ticket',
    ]);

    Ticket::factory()->create([
        'user_id' => $other->id,
        'title' => 'Other Customer Ticket',
    ]);

    $response = $this->actingAs($customer)->getJson('/api/tickets');

    $response->assertStatus(200);
    $response->assertJsonFragment(['title' => 'Customer Ticket']);
    $response->assertJsonMissing(['title' => 'Other Customer Ticket']);
});

test('agent can see all tickets', function () {
    $agent = User::factory()->create(['role' => 'agent']);
    $u = User::factory()->create();

    Ticket::factory()->create(['user_id' => $u->id, 'title' => 'User Ticket']);
    Ticket::factory()->create(['user_id' => $agent->id, 'title' => 'Agent Ticket']);

    $response = $this->actingAs($agent)->getJson('/api/tickets');

    $response->assertStatus(200);
    $response->assertJsonFragment(['title' => 'User Ticket']);
    $response->assertJsonFragment(['title' => 'Agent Ticket']);
});

test('admin can see all tickets', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $u = User::factory()->create();

    Ticket::factory()->create(['user_id' => $u->id, 'title' => 'User Ticket']);
    Ticket::factory()->create(['user_id' => $admin->id, 'title' => 'Admin Ticket']);

    $response = $this->actingAs($admin)->getJson('/api/tickets');

    $response->assertStatus(200);
    $response->assertJsonFragment(['title' => 'User Ticket']);
    $response->assertJsonFragment(['title' => 'Admin Ticket']);
});

test('unauthenticated user cannot access tickets', function () {
    $response = $this->getJson('/api/tickets');

    $response->assertStatus(401);
});

test('customer can create ticket', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $payload = [
        'title' => 'New Customer Ticket',
    ];

    $response = $this->actingAs($customer)->postJson('/api/tickets', $payload);
    $response->assertJsonFragment(['title' => 'New Customer Ticket']);
});


test('admin can create ticket', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $payload = [
        'title' => 'Admin Created Ticket',
        'description' => 'Admin description',
        'status' => 'open',
    ];

    $response = $this->actingAs($admin)->postJson('/api/tickets', $payload);
    $response->assertStatus(201);
    $response->assertJsonFragment(['title' => 'Admin Created Ticket']);
});

test('agent cannot create ticket', function () {
    $agent = User::factory()->create(['role' => 'agent']);

    $payload = [
        'title' => 'Agent Ticket Attempt',
        'description' => 'Agent should not be allowed',
        'status' => 'open',
    ];

    $response = $this->actingAs($agent)->postJson('/api/tickets', $payload);

    $response->assertStatus(403);
});

test('validation fails with invalid data', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $payload = [
        'description' => 'No title provided',
        'status' => 'open',
    ];

    $response = $this->actingAs($customer)->postJson('/api/tickets', $payload);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors('title');
});
