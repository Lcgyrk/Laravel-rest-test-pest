<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\TestCase;

class TicketValidationTest extends TestCase
{
    /**
     * Test that ticket title is required.
     */
    public function test_ticket_title_is_required(): void
    {
        $data = [
            'description' => 'This is a test description with enough characters',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ];

        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    /**
     * Test that ticket description is required.
     */
    public function test_ticket_description_is_required(): void
    {
        $data = [
            'title' => 'Test Ticket',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ];

        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
    }

    /**
     * Test that ticket description must be at least 10 characters.
     */
    public function test_ticket_description_minimum_length(): void
    {
        $data = [
            'title' => 'Test',
            'description' => 'Short',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ];

        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('description', $validator->errors()->toArray());
    }

    /**
     * Test that ticket title cannot exceed 255 characters.
     */
    public function test_ticket_title_maximum_length(): void
    {
        $data = [
            'title' => str_repeat('a', 256),
            'description' => 'This is a test description with enough characters',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ];

        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('title', $validator->errors()->toArray());
    }

    /**
     * Test that valid ticket data passes validation.
     */
    public function test_valid_ticket_data_passes_validation(): void
    {
        $data = [
            'title' => 'Valid Ticket Title',
            'description' => 'This is a valid description with enough characters',
        ];

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'required|string|min:10',
        ];

        $validator = Validator::make($data, $rules);

        $this->assertFalse($validator->fails());
    }

    /**
     * Test that ticket status validation rules work correctly.
     */
    public function test_ticket_status_validation(): void
    {
        $validStatuses = ['open', 'in_progress', 'resolved', 'closed'];

        foreach ($validStatuses as $status) {
            $data = ['status' => $status];
            $rules = ['status' => 'sometimes|string|in:open,in_progress,resolved,closed'];
            $validator = Validator::make($data, $rules);

            $this->assertFalse($validator->fails(), "Status '{$status}' should be valid");
        }
    }

    /**
     * Test that invalid ticket status fails validation.
     */
    public function test_invalid_ticket_status_fails_validation(): void
    {
        $data = ['status' => 'invalid_status'];
        $rules = ['status' => 'sometimes|string|in:open,in_progress,resolved,closed'];
        $validator = Validator::make($data, $rules);

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('status', $validator->errors()->toArray());
    }
}
