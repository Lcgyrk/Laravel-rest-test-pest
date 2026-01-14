php artisan install:api
php artisan migrate:refresh
php artisan make:controller AuthController

php artisan make:model Post --api -m


php artisan make:policy PostPolicy --model=Post

php artisan make:policy UserPolicy
