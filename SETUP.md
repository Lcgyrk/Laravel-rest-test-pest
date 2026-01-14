# LaraDesk - Support Ticket System

A modern, full-stack support ticket management system built with Laravel backend and vanilla JavaScript frontend.

## Features

### Backend (Laravel + Sanctum API)
- **Authentication**: Register, Login, Logout with token-based auth
- **Role-Based Access Control**: Admin, Agent, and Customer roles
- **Ticket Management**: Full CRUD operations with status tracking
- **User Management**: Admin can create and manage users
- **Policy-Based Authorization**: Fine-grained permissions

### Frontend (Vanilla JS + Tailwind CSS)
- **Modern SPA**: Single Page Application with client-side routing
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Dynamic content loading without page refresh
- **Role-Specific UI**: Different interfaces for different user roles
- **Toast Notifications**: User-friendly feedback system

## Tech Stack

- **Backend**: Laravel 11, PHP 8.2+
- **Frontend**: Vanilla JavaScript (ES6+), Tailwind CSS v4
- **Database**: SQLite (can be changed to MySQL/PostgreSQL)
- **Build Tool**: Vite
- **Authentication**: Laravel Sanctum (Token-based)

## User Roles & Permissions

### Customer
- Create new tickets
- View their own tickets
- Update their own ticket details
- Close their own tickets
- Cannot change ticket status (except closing)

### Agent
- View all tickets
- Update ticket status (open, in_progress, resolved, closed)
- Cannot create tickets
- Cannot delete tickets

### Admin
- Full access to all features
- Create tickets
- Manage all tickets (CRUD)
- Manage users (CRUD)
- Delete tickets and users

## Installation & Setup

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm

### Setup Steps

1. **Install PHP Dependencies**
```bash
composer install
```

2. **Install Node Dependencies**
```bash
npm install
```

3. **Configure Environment**
```bash
# Copy .env.example to .env (if not already done)
cp .env.example .env

# Generate application key
php artisan key:generate
```

4. **Setup Database**
```bash
# Run migrations
php artisan migrate

# (Optional) Seed database with sample data
php artisan db:seed
```

5. **Build Frontend Assets**
```bash
# For development (with hot reload)
npm run dev

# For production
npm run build
```

6. **Start Laravel Server**
```bash
# In a separate terminal
php artisan serve
```

7. **Access Application**
Open your browser and navigate to: `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (requires auth)
- `GET /api/user` - Get current user (requires auth)

### Tickets
- `GET /api/tickets` - List tickets (filtered by role)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/{id}` - View ticket details
- `PUT /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket (admin only)

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `DELETE /api/users/{id}` - Delete user

## Development

### Running Development Server
```bash
# Terminal 1 - Laravel backend
php artisan serve

# Terminal 2 - Vite dev server (hot reload)
npm run dev
```

### Creating Test Users

You can register users through the UI or create them using tinker:

```bash
php artisan tinker

# Create an admin
User::create([
    'name' => 'Admin User',
    'email' => 'admin@laradesk.test',
    'password' => Hash::make('password'),
    'role' => 'admin'
]);

# Create an agent
User::create([
    'name' => 'Agent User',
    'email' => 'agent@laradesk.test',
    'password' => Hash::make('password'),
    'role' => 'agent'
]);

# Create a customer
User::create([
    'name' => 'Customer User',
    'email' => 'customer@laradesk.test',
    'password' => Hash::make('password'),
    'role' => 'customer'
]);
```

## Usage Guide

### For Customers
1. Register or login to your account
2. Click "New Ticket" to create a support ticket
3. Fill in the title and description
4. Track your ticket status on the dashboard
5. Close tickets when resolved

### For Agents
1. Login with agent credentials
2. View all tickets from all customers
3. Update ticket status (open → in_progress → resolved → closed)
4. Help resolve customer issues

### For Admins
1. Login with admin credentials
2. Full access to ticket management
3. Access user management from navigation
4. Create new users with specific roles
5. Delete tickets or users as needed

## Security Features

- Token-based authentication (Laravel Sanctum)
- Password hashing (bcrypt)
- CSRF protection
- Policy-based authorization
- Input validation and sanitization
- XSS protection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open-sourced software licensed under the MIT license.
