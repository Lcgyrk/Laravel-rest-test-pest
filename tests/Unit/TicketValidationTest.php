<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Unit tests for simple validation logic.
 * 
 * Note: For testing Laravel's Validator facade, use Feature tests instead
 * as they require the full Laravel application context.
 * These tests demonstrate pure PHP logic testing.
 */
class TicketValidationTest extends TestCase
{
    /**
     * Test that a string exceeds maximum length.
     */
    public function test_string_exceeds_maximum_length(): void
    {
        $title = str_repeat('a', 256);
        $maxLength = 255;

        $this->assertGreaterThan($maxLength, strlen($title));
    }

    /**
     * Test that a string meets minimum length requirement.
     */
    public function test_string_meets_minimum_length(): void
    {
        $description = 'This is a valid description';
        $minLength = 10;

        $this->assertGreaterThanOrEqual($minLength, strlen($description));
    }

    /**
     * Test that a string is below minimum length.
     */
    public function test_string_below_minimum_length(): void
    {
        $description = 'Short';
        $minLength = 10;

        $this->assertLessThan($minLength, strlen($description));
    }

    /**
     * Test that valid statuses are in the allowed list.
     */
    public function test_status_is_in_allowed_list(): void
    {
        $allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        $testStatus = 'open';

        $this->assertContains($testStatus, $allowedStatuses);
    }

    /**
     * Test that invalid status is not in allowed list.
     */
    public function test_invalid_status_not_in_allowed_list(): void
    {
        $allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        $testStatus = 'invalid_status';

        $this->assertNotContains($testStatus, $allowedStatuses);
    }

    /**
     * Test that all valid statuses are in allowed list.
     */
    public function test_all_valid_statuses_are_allowed(): void
    {
        $allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        $statusesToTest = ['open', 'in_progress', 'resolved', 'closed'];

        foreach ($statusesToTest as $status) {
            $this->assertContains($status, $allowedStatuses);
        }
    }

    /**
     * Test email format validation using regex.
     */
    public function test_email_format_is_valid(): void
    {
        $email = 'test@example.com';
        $emailPattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';

        $this->assertMatchesRegularExpression($emailPattern, $email);
    }

    /**
     * Test invalid email format.
     */
    public function test_invalid_email_format(): void
    {
        $email = 'invalid-email';
        $emailPattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';

        $this->assertDoesNotMatchRegularExpression($emailPattern, $email);
    }
}
