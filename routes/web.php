<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectCategoryController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TingkatanController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('tingkatans', TingkatanController::class)->except(['show']);
    Route::resource('subject-categories', SubjectCategoryController::class)->except(['show']);
    Route::resource('subjects', SubjectController::class)->except(['show']);
    Route::resource('academic-years', AcademicYearController::class)->except(['show']);
    Route::resource('semesters', SemesterController::class)->except(['show']);
    Route::resource('teachers', TeacherController::class)->except(['show']);
    Route::resource('students', StudentController::class)->except(['show']);
});

require __DIR__.'/auth.php';
