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