<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Services\StudentEvaluationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly StudentEvaluationService $studentEvaluationService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = $this->studentEvaluationService->resolveStudent($user);

        if (!$student) {
            abort(403, 'Profil siswa tidak ditemukan.');
        }

        $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();

        $teacherSummaries = [];
        $stats = [
            'total_teachers' => 0,
            'completed' => 0,
            'pending' => 0,
        ];

        if ($activePeriod) {
            $assignments = $this->studentEvaluationService->getTeachingAssignments($student, $activePeriod);
            $teacherSummaries = $this->studentEvaluationService->buildTeacherSummaries($student, $activePeriod, $assignments);

            $stats['total_teachers'] = count($teacherSummaries);
            $stats['completed'] = count(array_filter($teacherSummaries, fn($t) => $t['status'] === 'submitted'));
            $stats['pending'] = $stats['total_teachers'] - $stats['completed'];
        }

        return Inertia::render('Student/Dashboard', [
            'student' => $student->load('kelas.tingkatan'),
            'activePeriod' => $activePeriod,
            'teachers' => $teacherSummaries,
            'stats' => $stats,
        ]);
    }
}
