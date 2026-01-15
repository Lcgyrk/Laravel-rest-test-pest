<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that authenticated user can create a ticket.
     */
    public function test_user_can_create_ticket(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Test Ticket',
                'description' => 'This is a test description with enough characters',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Ticket created successfully',
            ])
            ->assertJsonStructure([
                'message',
                'ticket' => [
                    'id',
                    'title',
                    'description',
                    'status',
                    'user_id',
                ],
            ]);

        $this->assertDatabaseHas('tickets', [
            'title' => 'Test Ticket',
            'description' => 'This is a test description with enough characters',
            'status' => 'open',
            'user_id' => $user->id,
        ]);
    }

    /**
     * Test that unauthenticated user cannot create a ticket.
     */
    public function test_unauthenticated_user_cannot_create_ticket(): void
    {
        $response = $this->postJson('/api/tickets', [
            'title' => 'Test Ticket',
            'description' => 'This is a test description',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test that ticket creation requires title.
     */
    public function test_ticket_requires_title(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'description' => 'This is a test description',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /**
     * Test that ticket creation requires description.
     */
    public function test_ticket_requires_description(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/tickets', [
                'title' => 'Test Ticket',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['description']);
    }

    /**
     * Test that customer can view their own tickets.
     */
    public function test_customer_can_view_own_tickets(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $ticket = Ticket::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/tickets');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'tickets' => [
                    '*' => [
                        'id',
                        'title',
                        'description',
                        'status',
                        'user_id',
                    ],
                ],
            ]);
    }

    /**
     * Test that admin can view all tickets.
     */
    public function test_admin_can_view_all_tickets(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);
        
        Ticket::factory()->create(['user_id' => $admin->id]);
        Ticket::factory()->create(['user_id' => $customer->id]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/tickets');

        $response->assertStatus(200);
        $tickets = $response->json('tickets');
        
        $this->assertGreaterThanOrEqual(2, count($tickets));
    }

    /**
     * Test that user can view specific ticket they own.
     */
    public function test_user_can_view_own_ticket(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $ticket = Ticket::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Ticket retrieved successfully',
                'ticket' => [
                    'id' => $ticket->id,
                    'title' => $ticket->title,
                ],
            ]);
    }

    /**
     * Test that customer can update their own ticket.
     */
    public function test_customer_can_update_own_ticket(): void
    {
        $user = User::factory()->create(['role' => 'customer']);
        $ticket = Ticket::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/tickets/{$ticket->id}", [
                'title' => 'Updated Title',
                'description' => 'Updated description with enough characters',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Ticket updated successfully',
                'ticket' => [
                    'title' => 'Updated Title',
                ],
            ]);

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'title' => 'Updated Title',
        ]);
    }

    /**
     * Test that admin can delete tickets.
     */
    public function test_admin_can_delete_ticket(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $ticket = Ticket::factory()->create(['user_id' => $admin->id]);

        $response = $this->actingAs($admin, 'sanctum')
            ->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Ticket deleted successfully',
            ]);

        $this->assertDatabaseMissing('tickets', [
            'id' => $ticket->id,
        ]);
    }
}
