<?php

namespace Tests\Unit;

use App\Models\Ticket;
use PHPUnit\Framework\TestCase;

class TicketModelTest extends TestCase
{
    /**
     * Test that the Ticket model has the correct fillable fields.
     */
    public function test_ticket_has_correct_fillable_fields(): void
    {
        $ticket = new Ticket();
        $fillable = $ticket->getFillable();

        $this->assertContains('title', $fillable);
        $this->assertContains('description', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('user_id', $fillable);
    }

    /**
     * Test that the Ticket model has the correct casts.
     */
    public function test_ticket_has_correct_casts(): void
    {
        $ticket = new Ticket();
        $casts = $ticket->getCasts();

        $this->assertEquals('datetime', $casts['created_at']);
        $this->assertEquals('datetime', $casts['updated_at']);
    }

    /**
     * Test that fillable array has exactly 4 fields.
     */
    public function test_ticket_fillable_count(): void
    {
        $ticket = new Ticket();
        $fillable = $ticket->getFillable();

        $this->assertCount(4, $fillable);
    }

    /**
     * Test that Ticket model has user relationship method.
     */
    public function test_ticket_has_user_relationship_method(): void
    {
        $ticket = new Ticket();

        $this->assertTrue(method_exists($ticket, 'user'));
    }
}
