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

test('admin can create new user', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $payload = [
        'name' => 'New User',
        'email' => 'newuser@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'customer',
    ];

    $response = $this->actingAs($admin)->postJson('/api/users', $payload);

    $response->assertStatus(201);
    $response->assertJsonFragment(['name' => 'New User']);
    $this->assertDatabaseHas('users', ['email' => 'newuser@example.com']);
});

test('validation fails with duplicate email', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $existingUser = User::factory()->create(['email' => 'existing@example.com']);

    $payload = [
        'name' => 'New User',
        'email' => 'existing@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => 'customer',
    ];

    $response = $this->actingAs($admin)->postJson('/api/users', $payload);

    $response->assertStatus(422);
});
