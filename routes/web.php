<?php

use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvaluationPeriodController;
use App\Http\Controllers\KelasController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\StudentEvaluationController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentMonitoringController;
use App\Http\Controllers\SubjectCategoryController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherRankingController;
use App\Http\Controllers\TeachingAssignmentController;
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
    Route::resource('kelas', KelasController::class)->except(['show']);
    Route::resource('subject-categories', SubjectCategoryController::class)->except(['show']);
    Route::resource('subjects', SubjectController::class)->except(['show']);
    Route::resource('academic-years', AcademicYearController::class)->except(['show']);
    Route::resource('semesters', SemesterController::class)->except(['show']);
    Route::resource('teachers', TeacherController::class)->except(['show']);
    Route::resource('students', StudentController::class)->except(['show']);
    Route::resource('teaching-assignments', TeachingAssignmentController::class)->except(['show']);
    Route::patch('questions/bulk', [QuestionController::class, 'bulkUpdate'])->name('questions.bulk');
    Route::patch('questions/{question}/move', [QuestionController::class, 'move'])->name('questions.move');
    Route::resource('questions', QuestionController::class)->except(['show']);
    Route::resource('evaluation-periods', EvaluationPeriodController::class)->except(['show']);
    Route::get('student-evaluations', [StudentEvaluationController::class, 'index'])->name('student-evaluations.index');
    Route::post('student-evaluations/select-student', [StudentEvaluationController::class, 'selectStudent'])->name('student-evaluations.select-student');
    Route::get('student-evaluations/teachers/{teacher}', [StudentEvaluationController::class, 'show'])->name('student-evaluations.teachers.show');
    Route::put('student-evaluations/{evaluation}', [StudentEvaluationController::class, 'update'])->name('student-evaluations.update');
    Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('teacher-rankings', [TeacherRankingController::class, 'index'])->name('teacher-rankings.index');
    Route::get('student-monitoring', [StudentMonitoringController::class, 'index'])->name('student-monitoring.index');
    Route::get('reports/teachers', [ReportController::class, 'teacher'])->name('reports.teacher');
    Route::get('reports/classes', [ReportController::class, 'classReport'])->name('reports.class');
    Route::get('reports/subjects', [ReportController::class, 'subject'])->name('reports.subject');
    Route::get('reports/categories', [ReportController::class, 'category'])->name('reports.category');
    Route::get('reports/evaluation-periods', [ReportController::class, 'evaluationPeriod'])->name('reports.evaluation-period');
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

require __DIR__.'/auth.php';
