<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Public Routes

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

// get all categories
Route::get('/categories', [CategoryController::class, 'index']);
// get a single category
Route::get('/categories/{id}', [CategoryController::class, 'show']);
// get all products
Route::get('/products', [ProductController::class, 'index']);
// get a single product
Route::get('/products/{id}', [ProductController::class, 'show']);

// Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Category Routes

    // create a category
    Route::post('/categories', [CategoryController::class, 'store']);
    // update a category
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    // delete a category
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Product Routes

    // create a product
    Route::post('/products', [ProductController::class, 'store']);
    // update a product
    Route::put('/products/{id}', [ProductController::class, 'update']);
    // delete a product
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});