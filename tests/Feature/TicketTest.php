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