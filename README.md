# LaraDesk - Support Ticket System

A modern Laravel REST API with comprehensive testing examples.

## Documentation

- **[Setup Guide](SETUP.md)** - Installation and configuration instructions
- **[Testing Guide](TESTING.md)** - Learn where endpoints are and what to test with unit tests

## Quick Start

```bash
# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate

# Run tests
php artisan test
```

## Project Structure

- `routes/api.php` - API endpoint definitions
- `app/Http/Controllers/` - Controller implementations
- `app/Models/` - Eloquent models
- `tests/Unit/` - Unit tests for isolated components
- `tests/Feature/` - Feature tests for API endpoints

## Testing

This project includes comprehensive unit and feature tests demonstrating Laravel testing best practices.

See [TESTING.md](TESTING.md) for detailed testing documentation in Hungarian and English.
