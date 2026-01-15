# Tesztelési Útmutató / Testing Guide

## Hol vannak a végpontok egy Laravel alkalmazásban? / Where are the endpoints in a Laravel application?

### API végpontok helye / API Endpoints Location

A Laravel alkalmazásban az API végpontok a következő helyen vannak definiálva:

📁 **`routes/api.php`** - Ez a fájl tartalmazza az összes API útvonalat

In a Laravel application, API endpoints are defined in:

📁 **`routes/api.php`** - This file contains all API routes

### Ebben a projektben / In This Project

A `routes/api.php` fájl tartalmazza a következő végpontokat:

**Autentikáció (Authentication):**
- `POST /api/register` - Új felhasználó regisztrációja
- `POST /api/login` - Felhasználó bejelentkezés
- `POST /api/logout` - Felhasználó kijelentkezés (auth szükséges)
- `GET /api/user` - Jelenlegi felhasználó lekérése (auth szükséges)

**Jegyek (Tickets):**
- `GET /api/tickets` - Jegyek listázása
- `POST /api/tickets` - Új jegy létrehozása
- `GET /api/tickets/{id}` - Jegy részletei
- `PUT /api/tickets/{id}` - Jegy módosítása
- `DELETE /api/tickets/{id}` - Jegy törlése

**Felhasználók (Users - Admin only):**
- `GET /api/users` - Felhasználók listázása
- `POST /api/users` - Új felhasználó létrehozása
- `DELETE /api/users/{id}` - Felhasználó törlése

### Végpontok implementációja / Endpoint Implementation

A végpontok a **Controller**-ekben vannak implementálva:
- `app/Http/Controllers/AuthController.php` - Autentikáció
- `app/Http/Controllers/TicketController.php` - Jegy műveletek
- `app/Http/Controllers/UserController.php` - Felhasználó műveletek

---

## Mit lehet tesztelni unit tesztekkel? / What can be tested with unit tests?

### Unit Tesztek vs. Feature Tesztek / Unit Tests vs. Feature Tests

Laravel-ben kétféle teszt van:

1. **Unit Tesztek** (`tests/Unit/`) - Izolált komponensek tesztelése
2. **Feature Tesztek** (`tests/Feature/`) - Teljes HTTP kérések és válaszok tesztelése

In Laravel, there are two types of tests:

1. **Unit Tests** (`tests/Unit/`) - Testing isolated components
2. **Feature Tests** (`tests/Feature/`) - Testing complete HTTP requests and responses

### Mit tesztelünk Unit tesztekkel? / What do we test with Unit Tests?

Unit tesztek **izolált** komponenseket tesztelnek, az adatbázis és HTTP réteg nélkül:

#### 1. **Model Logika / Model Logic**

Tesztelhető funkciók a `Ticket` és `User` modelleknél:
- Kapcsolatok (relationships)
- Scope-ok
- Attribútum casting
- Egyedi metódusok

**Példa / Example:**

```php
<?php

namespace Tests\Unit;

use App\Models\Ticket;
use App\Models\User;
use PHPUnit\Framework\TestCase;

class TicketModelTest extends TestCase
{
    public function test_ticket_has_correct_fillable_fields(): void
    {
        $ticket = new Ticket();
        $fillable = $ticket->getFillable();
        
        $this->assertContains('title', $fillable);
        $this->assertContains('description', $fillable);
        $this->assertContains('status', $fillable);
        $this->assertContains('user_id', $fillable);
    }
    
    public function test_ticket_has_correct_casts(): void
    {
        $ticket = new Ticket();
        $casts = $ticket->getCasts();
        
        $this->assertEquals('datetime', $casts['created_at']);
        $this->assertEquals('datetime', $casts['updated_at']);
    }
}
```

#### 2. **Validációs Logika / Validation Logic**

Egyszerű validációs logika tesztelése (tiszta PHP):

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class TicketValidationTest extends TestCase
{
    public function test_string_exceeds_maximum_length(): void
    {
        $title = str_repeat('a', 256);
        $maxLength = 255;

        $this->assertGreaterThan($maxLength, strlen($title));
    }
    
    public function test_status_is_in_allowed_list(): void
    {
        $allowedStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        $testStatus = 'open';

        $this->assertContains($testStatus, $allowedStatuses);
    }
}
```

**Fontos / Important:** Laravel Validator facade tesztelése **Feature tesztekben** történik, nem Unit tesztekben! A Unit tesztek tiszta PHP logikát tesztelnek, Laravel függőségek nélkül.

**Important:** Testing Laravel's Validator facade should be done in **Feature tests**, not Unit tests! Unit tests should test pure PHP logic without Laravel dependencies.

#### 3. **Segédfüggvények / Helper Functions**

Ha vannak egyedi segédfüggvények:

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class HelperTest extends TestCase
{
    public function test_format_ticket_status(): void
    {
        // Ha van ilyen helper függvény
        $result = format_status('in_progress');
        $this->assertEquals('In Progress', $result);
    }
}
```

#### 4. **Üzleti Logika / Business Logic**

Bármilyen üzleti logika, amely nem függ az adatbázistól:

```php
<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserRoleTest extends TestCase
{
    public function test_customer_role_permissions(): void
    {
        // Ha a User modellben van ilyen metódus
        $user = new User(['role' => 'customer']);
        
        $this->assertFalse($user->isAdmin());
        $this->assertFalse($user->isAgent());
        $this->assertTrue($user->isCustomer());
    }
}
```

### Mit NEM tesztelünk Unit tesztekkel? / What do we NOT test with Unit Tests?

❌ **HTTP kérések és válaszok** - Ezek Feature tesztek
❌ **Adatbázis műveletek** - Ezek Feature tesztek
❌ **Autentikáció flow** - Ezek Feature tesztek
❌ **Teljes végpont tesztelés** - Ezek Feature tesztek

---

## Feature Tesztek API végpontokhoz / Feature Tests for API Endpoints

A **végpontok tesztelése Feature tesztekkel történik**, nem Unit tesztekkel!

**API endpoints should be tested with Feature tests, not Unit tests!**

**Példa Feature tesztre / Example Feature Test:**

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketApiTest extends TestCase
{
    use RefreshDatabase;

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
            ]);
    }

    public function test_unauthenticated_user_cannot_create_ticket(): void
    {
        $response = $this->postJson('/api/tickets', [
            'title' => 'Test Ticket',
            'description' => 'This is a test description',
        ]);

        $response->assertStatus(401);
    }

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
}
```

---

## Tesztek futtatása / Running Tests

### Összes teszt futtatása / Run all tests:
```bash
php artisan test
```

### Csak Unit tesztek / Only Unit tests:
```bash
php artisan test --testsuite=Unit
```

### Csak Feature tesztek / Only Feature tests:
```bash
php artisan test --testsuite=Feature
```

### Egy konkrét teszt fájl / Specific test file:
```bash
php artisan test tests/Unit/TicketModelTest.php
```

### Részletes kimenet / Verbose output:
```bash
php artisan test --parallel
```

---

## Összefoglalás / Summary

### 🎯 Unit Tesztek Célja / Purpose of Unit Tests

Unit tesztek az **izolált komponensek** tesztelésére szolgálnak:
- Model attribútumok és metódusok
- Validációs szabályok
- Segédfüggvények
- Üzleti logika (adatbázis nélkül)

Unit tests are for testing **isolated components**:
- Model attributes and methods
- Validation rules
- Helper functions
- Business logic (without database)

### 🎯 Feature Tesztek Célja / Purpose of Feature Tests

Feature tesztek a **teljes funkcionalitás** tesztelésére szolgálnak:
- API végpontok
- HTTP kérések és válaszok
- Autentikáció
- Adatbázis műveletek
- Integráció

Feature tests are for testing **complete functionality**:
- API endpoints
- HTTP requests and responses
- Authentication
- Database operations
- Integration

### 📝 Jó Gyakorlat / Best Practice

Ebben a projektben:
- **Unit tesztek**: Model logika, validációs szabályok tesztelése
- **Feature tesztek**: API végpontok, autentikáció, engedélyezés tesztelése

In this project:
- **Unit tests**: Test model logic and validation rules
- **Feature tests**: Test API endpoints, authentication, and authorization

---

## További Források / Additional Resources

- [Laravel Testing Documentation](https://laravel.com/docs/testing)
- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Laravel HTTP Tests](https://laravel.com/docs/http-tests)
