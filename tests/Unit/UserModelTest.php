<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserModelTest extends TestCase
{
    /**
     * Test that the User model has the correct fillable fields.
     */
    public function test_user_has_required_fillable_fields(): void
    {
        $user = new User();
        $fillable = $user->getFillable();

        $this->assertContains('name', $fillable);
        $this->assertContains('email', $fillable);
        $this->assertContains('password', $fillable);
    }

    /**
     * Test that the User model has the correct hidden fields.
     */
    public function test_user_has_hidden_fields(): void
    {
        $user = new User();
        $hidden = $user->getHidden();

        $this->assertContains('password', $hidden);
        $this->assertContains('remember_token', $hidden);
    }

    /**
     * Test that the User model has the correct casts.
     */
    public function test_user_has_correct_casts(): void
    {
        $user = new User();
        $casts = $user->getCasts();

        $this->assertArrayHasKey('email_verified_at', $casts);
        $this->assertArrayHasKey('password', $casts);
    }

    /**
     * Test that User model has tickets relationship method.
     */
    public function test_user_has_tickets_relationship_method(): void
    {
        $user = new User();

        $this->assertTrue(method_exists($user, 'tickets'));
    }
}
