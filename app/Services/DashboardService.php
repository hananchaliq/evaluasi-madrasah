<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use App\Models\Tingkatan;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class DashboardService
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * Build dashboard payload for the admin home page.
     *
     * @return array<string, mixed>
     */
    public function getData(Request $request): array
    {
        $academicYears = AcademicYear::query()
            ->orderByDesc('nama')
            ->get(['id', 'nama', 'is_active']);

        $selectedAcademicYearId = $this->resolveAcademicYearId(
            $request->input('academic_year_id'),
            $academicYears,
        );

        $semesters = Semester::query()
            ->when(
                $selectedAcademicYearId,
                fn (Builder $query) => $query->where('academic_year_id', $selectedAcademicYearId),
            )
            ->orderBy('nama')
            ->get(['id', 'nama', 'academic_year_id', 'is_active']);

        $selectedSemesterId = $this->resolveSemesterId(
            $request->input('semester_id'),
            $semesters,
        );

        $activeEvaluationPeriod = $this->getActiveEvaluationPeriod(
            $selectedAcademicYearId,
            $selectedSemesterId,
        );

        return [
            'filters' => [
                'academic_year_id' => $selectedAcademicYearId,
                'semester_id' => $selectedSemesterId,
            ],
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'activeEvaluationPeriod' => $activeEvaluationPeriod,
            'insights' => $this->getInsights($selectedAcademicYearId, $selectedSemesterId),
            'overview' => $this->getOverview(),
            'alerts' => array_merge(
                $this->notificationService->getDashboardNotifications(),
                $this->getAlerts($activeEvaluationPeriod, $selectedAcademicYearId, $selectedSemesterId),
            ),
        ];
    }

    /**
     * @param  Collection<int, AcademicYear>  $academicYears
     */
    private function resolveAcademicYearId(mixed $requestedId, Collection $academicYears): ?int
    {
        if ($requestedId) {
            return (int) $requestedId;
        }

        $activeYear = $academicYears->firstWhere('is_active', true);

        return $activeYear?->id;
    }

    /**
     * @param  Collection<int, Semester>  $semesters
     */
    private function resolveSemesterId(mixed $requestedId, Collection $semesters): ?int
    {
        if ($requestedId) {
            return (int) $requestedId;
        }

        $activeSemester = $semesters->firstWhere('is_active', true);

        return $activeSemester?->id;
    }

    private function getActiveEvaluationPeriod(?int $academicYearId, ?int $semesterId): ?array
    {
        $period = EvaluationPeriod::query()
            ->with(['academicYear:id,nama', 'semester:id,nama'])
            ->where('is_active', true)
            ->when($academicYearId, fn (Builder $query) => $query->where('academic_year_id', $academicYearId))
            ->when($semesterId, fn (Builder $query) => $query->where('semester_id', $semesterId))
            ->first();

        if (! $period) {
            return null;
        }

        return [
            'id' => $period->id,
            'nama' => $period->nama,
            'start_date' => $period->start_date->format('Y-m-d'),
            'end_date' => $period->end_date->format('Y-m-d'),
            'is_locked' => $period->is_locked,
            'is_anonymous' => $period->is_anonymous,
            'academic_year' => $period->academicYear?->nama,
            'semester' => $period->semester?->nama,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getInsights(?int $academicYearId, ?int $semesterId): array
    {
        $submittedQuery = Evaluation::query()
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->when($academicYearId, fn (Builder $query) => $query->where('academic_year_id', $academicYearId))
            ->when($semesterId, fn (Builder $query) => $query->where('semester_id', $semesterId));

        $totalResponses = (clone $submittedQuery)->count();
        $totalExpected = $this->calculateExpectedEvaluations($academicYearId, $semesterId);
        $responseRate = $totalExpected > 0
            ? round(($totalResponses / $totalExpected) * 100, 1)
            : 0.0;

        $averageInstitutionScore = (clone $submittedQuery)
            ->whereNotNull('average_score')
            ->avg('average_score');

        $teacherStats = (clone $submittedQuery)
            ->select('teacher_id')
            ->selectRaw('AVG(average_score) as average_score')
            ->selectRaw('COUNT(*) as total_evaluations')
            ->groupBy('teacher_id')
            ->with('teacher:id,nama')
            ->get();

        $highestRatedTeacher = $this->formatTeacherHighlight(
            $teacherStats->sortByDesc('average_score')->first(),
            'average_score',
        );

        $lowestRatedTeacher = $this->formatTeacherHighlight(
            $teacherStats->sortBy('average_score')->first(),
            'average_score',
        );

        $mostEvaluatedTeacher = $this->formatTeacherHighlight(
            $teacherStats->sortByDesc('total_evaluations')->first(),
            'total_evaluations',
        );

        $completionPercentage = $this->calculateCompletionPercentage($academicYearId, $semesterId);

        return [
            'total_responses' => $totalResponses,
            'response_rate' => $responseRate,
            'average_institution_score' => $averageInstitutionScore
                ? round((float) $averageInstitutionScore, 2)
                : null,
            'highest_rated_teacher' => $highestRatedTeacher,
            'lowest_rated_teacher' => $lowestRatedTeacher,
            'most_evaluated_teacher' => $mostEvaluatedTeacher,
            'completion_percentage' => $completionPercentage,
            'total_expected' => $totalExpected,
        ];
    }

    private function calculateExpectedEvaluations(?int $academicYearId, ?int $semesterId): int
    {
        if (! $academicYearId || ! $semesterId) {
            return 0;
        }

        $assignments = TeachingAssignment::query()
            ->where('academic_year_id', $academicYearId)
            ->where('semester_id', $semesterId)
            ->get(['kelas_id', 'teacher_id']);

        if ($assignments->isEmpty()) {
            return 0;
        }

        $students = Student::query()
            ->whereNotNull('kelas_id')
            ->get(['id', 'kelas_id']);

        $assignmentsByKelas = $assignments->groupBy('kelas_id');

        return $students->sum(function (Student $student) use ($assignmentsByKelas) {
            return $assignmentsByKelas->get($student->kelas_id)?->count() ?? 0;
        });
    }

    private function calculateCompletionPercentage(?int $academicYearId, ?int $semesterId): float
    {
        if (! $academicYearId || ! $semesterId) {
            return 0.0;
        }

        $students = Student::query()
            ->whereNotNull('kelas_id')
            ->get(['id', 'kelas_id']);

        if ($students->isEmpty()) {
            return 0.0;
        }

        $assignmentsByKelas = TeachingAssignment::query()
            ->where('academic_year_id', $academicYearId)
            ->where('semester_id', $semesterId)
            ->get(['kelas_id', 'teacher_id'])
            ->groupBy('kelas_id');

        $submittedCounts = Evaluation::query()
            ->select('student_id')
            ->selectRaw('COUNT(*) as total_submitted')
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->where('academic_year_id', $academicYearId)
            ->where('semester_id', $semesterId)
            ->groupBy('student_id')
            ->pluck('total_submitted', 'student_id');

        $completedStudents = $students->filter(function (Student $student) use ($assignmentsByKelas, $submittedCounts) {
            $required = $assignmentsByKelas->get($student->kelas_id)?->count() ?? 0;

            if ($required === 0) {
                return false;
            }

            return ($submittedCounts[$student->id] ?? 0) >= $required;
        })->count();

        return round(($completedStudents / $students->count()) * 100, 1);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function formatTeacherHighlight(mixed $stat, string $metric): ?array
    {
        if (! $stat || ! $stat->teacher) {
            return null;
        }

        return [
            'id' => $stat->teacher->id,
            'nama' => $stat->teacher->nama,
            'value' => $metric === 'average_score'
                ? round((float) $stat->average_score, 2)
                : (int) $stat->total_evaluations,
            'metric' => $metric,
        ];
    }

    /**
     * @return array<string, int>
     */
    private function getOverview(): array
    {
        return [
            'total_tingkatans' => Tingkatan::count(),
            'total_kelas' => Kelas::count(),
            'total_teachers' => Teacher::count(),
            'total_students' => Student::count(),
            'total_assignments' => TeachingAssignment::count(),
            'pending_evaluations' => Evaluation::query()
                ->where('status', Evaluation::STATUS_DRAFT)
                ->count(),
            'submitted_evaluations' => Evaluation::query()
                ->where('status', Evaluation::STATUS_SUBMITTED)
                ->count(),
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function getAlerts(?array $activePeriod, ?int $academicYearId, ?int $semesterId): array
    {
        $alerts = [];

        if (! $academicYearId || ! $semesterId) {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Filter Akademik',
                'message' => 'Pilih tahun akademik dan semester untuk melihat statistik evaluasi yang lebih akurat.',
            ];
        }

        if (! $activePeriod) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Periode Evaluasi',
                'message' => 'Belum ada periode evaluasi aktif untuk filter yang dipilih.',
            ];

            return $alerts;
        }

        $endDate = Carbon::parse($activePeriod['end_date']);
        $daysRemaining = now()->startOfDay()->diffInDays($endDate, false);

        if ($activePeriod['is_locked']) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Periode Terkunci',
                'message' => "Periode evaluasi \"{$activePeriod['nama']}\" sedang terkunci. Siswa tidak dapat mengirim evaluasi baru.",
            ];
        } else {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Periode Evaluasi Aktif',
                'message' => "Periode \"{$activePeriod['nama']}\" aktif hingga {$endDate->locale('id')->translatedFormat('d F Y')}.",
            ];
        }

        if ($daysRemaining >= 0 && $daysRemaining <= 7) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Batas Waktu Evaluasi',
                'message' => $daysRemaining === 0
                    ? 'Periode evaluasi berakhir hari ini.'
                    : "Periode evaluasi akan berakhir dalam {$daysRemaining} hari.",
            ];
        }

        $recentCompletions = Evaluation::query()
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->when($academicYearId, fn (Builder $query) => $query->where('academic_year_id', $academicYearId))
            ->when($semesterId, fn (Builder $query) => $query->where('semester_id', $semesterId))
            ->where('submitted_at', '>=', now()->subDay())
            ->count();

        if ($recentCompletions > 0) {
            $alerts[] = [
                'type' => 'success',
                'title' => 'Evaluasi Selesai',
                'message' => "{$recentCompletions} evaluasi berhasil dikirim dalam 24 jam terakhir.",
            ];
        }

        return $alerts;
    }
}
