<?php

use App\Http\Controllers\Admin\AcademicYearController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EvaluationMonitoringController;
use App\Http\Controllers\Admin\EvaluationPeriodController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\ImportController;
use App\Http\Controllers\Admin\KelasController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SemesterController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\SubjectCategoryController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\TeacherRankingController;
use App\Http\Controllers\Admin\TeachingAssignmentController;
use App\Http\Controllers\Admin\TingkatanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\EvaluationController as StudentEvaluationController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\EvaluationResultController;
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

Route::middleware(['auth', 'verified'])->group(function () {
    // Shared Dashboard Redirect
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Monitoring & Analytics
        Route::get('/evaluation-monitoring', [EvaluationMonitoringController::class, 'index'])->name('evaluation-monitoring.index');
        Route::get('/evaluation-monitoring/teachers/{teacher}', [EvaluationMonitoringController::class, 'show'])->name('evaluation-monitoring.show');

        // Resources
        Route::resource('tingkatans', TingkatanController::class)->except(['show']);
        Route::resource('kelas', KelasController::class)->except(['show']);
        Route::resource('subject-categories', SubjectCategoryController::class)->except(['show']);
        Route::resource('subjects', SubjectController::class)->except(['show']);
        Route::resource('academic-years', AcademicYearController::class)->except(['show']);
        Route::resource('semesters', SemesterController::class)->except(['show']);
        Route::resource('teachers', TeacherController::class)->except(['show']);
        Route::resource('students', StudentController::class)->except(['show']);
        Route::resource('teaching-assignments', TeachingAssignmentController::class)->except(['show']);

        // Questions
        Route::patch('questions/bulk', [QuestionController::class, 'bulkUpdate'])->name('questions.bulk');
        Route::patch('questions/{question}/move', [QuestionController::class, 'move'])->name('questions.move');
        Route::resource('questions', QuestionController::class)->except(['show']);

        Route::resource('evaluation-periods', EvaluationPeriodController::class)->except(['show']);

        // Analytics & Rankings
        Route::get('analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
        Route::get('teacher-rankings', [TeacherRankingController::class, 'index'])->name('teacher-rankings.index');

        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/teachers', [ReportController::class, 'teacher'])->name('teacher');
            Route::get('/classes', [ReportController::class, 'classReport'])->name('class');
            Route::get('/subjects', [ReportController::class, 'subject'])->name('subject');
            Route::get('/categories', [ReportController::class, 'category'])->name('category');
            Route::get('/evaluation-periods', [ReportController::class, 'evaluationPeriod'])->name('evaluation-period');

            // PDF exports
            Route::get('/teachers/pdf', [ReportController::class, 'downloadTeacherPdf'])->name('teacher.pdf');
            Route::get('/classes/pdf', [ReportController::class, 'downloadClassPdf'])->name('class.pdf');
            Route::get('/subjects/pdf', [ReportController::class, 'downloadSubjectPdf'])->name('subject.pdf');
            Route::get('/categories/pdf', [ReportController::class, 'downloadCategoryPdf'])->name('category.pdf');
            Route::get('/evaluation-periods/pdf', [ReportController::class, 'downloadEvaluationPeriodPdf'])->name('evaluation-period.pdf');
        });

        // Exports
        Route::prefix('exports')->name('exports.')->controller(ExportController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/teachers/excel', 'teachersExcel')->name('teachers.excel');
            Route::get('/teachers/pdf', 'teachersPdf')->name('teachers.pdf');
            Route::get('/students/excel', 'studentsExcel')->name('students.excel');
            Route::get('/students/pdf', 'studentsPdf')->name('students.pdf');
            Route::get('/kelas/excel', 'kelasExcel')->name('kelas.excel');
            Route::get('/kelas/pdf', 'kelasPdf')->name('kelas.pdf');
            Route::get('/subjects/excel', 'subjectsExcel')->name('subjects.excel');
            Route::get('/subjects/pdf', 'subjectsPdf')->name('subjects.pdf');
            Route::get('/assignments/excel', 'assignmentsExcel')->name('assignments.excel');
            Route::get('/assignments/pdf', 'assignmentsPdf')->name('assignments.pdf');
            Route::get('/evaluations/excel', 'evaluationsExcel')->name('evaluations.excel');
            Route::get('/evaluations/pdf', 'evaluationsPdf')->name('evaluations.pdf');
        });

        // Imports
        Route::prefix('imports/{type}')->name('imports.')->group(function () {
            Route::get('/import', [ImportController::class, 'show'])->name('show');
            Route::post('/import', [ImportController::class, 'store'])->name('store');
            Route::get('/import/template', [ImportController::class, 'downloadTemplate'])->name('template');
        });

        // System
        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });

    // Student Routes
    Route::middleware(['role:student'])->prefix('student')->name('student.')->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::get('/evaluations/{teacher}', [StudentEvaluationController::class, 'create'])->name('evaluations.create');
        Route::post('/evaluations/{teacher}', [StudentEvaluationController::class, 'store'])->name('evaluations.store');
        Route::put('/evaluations/{evaluation}', [StudentEvaluationController::class, 'update'])->name('evaluations.update');
    });

    // Teacher Routes
    Route::middleware(['role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])->name('dashboard');
        Route::get('/evaluation-results', [EvaluationResultController::class, 'index'])->name('evaluation-results.index');
        Route::get('/evaluation-results/{teacher}', [EvaluationResultController::class, 'show'])->name('evaluation-results.show');
    });
});

require __DIR__ . '/auth.php';
