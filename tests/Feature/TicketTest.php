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