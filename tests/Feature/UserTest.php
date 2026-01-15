<?php

use Tests\TestCase;
use App\Models\User;

it('has user page', function () {
    $response = $this->get('/user');

    $response->assertStatus(200);
});

test('only admin can list users', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create(['name' => 'Test User 1']);
    User::factory()->create(['name' => 'Test User 2']);

    $response = $this->actingAs($admin)->getJson('/api/users');

    $response->assertStatus(200);
    $response->assertJsonFragment(['name' => 'Test User 1']);
    $response->assertJsonFragment(['name' => 'Test User 2']);
});

test('agent cannot access users endpoint', function () {
    $agent = User::factory()->create(['role' => 'agent']);

    $response = $this->actingAs($agent)->getJson('/api/users');

    $response->assertStatus(403);
});

test('customer cannot access users endpoint', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $response = $this->actingAs($customer)->getJson('/api/users');

    $response->assertStatus(403);
});

test('returns all users with correct structure', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    User::factory()->create(['name' => 'Test User 1', 'email' => 'test1@example.com']);
    User::factory()->create(['name' => 'Test User 2', 'email' => 'test2@example.com']);

    $response = $this->actingAs($admin)->getJson('/api/users');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'message',
        'users' => [
            '*' => [
                'id',
                'name',
                'email',
                'role',
                'created_at',
                'updated_at',
            ]
        ]
    ]);
});
