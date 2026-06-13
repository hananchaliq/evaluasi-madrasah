<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Student;
use App\Models\TeachingAssignment;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class StudentMonitoringService
{
    public const STATUS_ALL = 'all';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_IN_PROGRESS = 'in_progress';

    public const STATUS_PENDING = 'pending';

    public const STATUS_NO_ASSIGNMENT = 'no_assignment';

    /**
     * @return array<string, mixed>
     */
    public function getData(Request $request): array
    {
        $academicYears = AcademicYear::query()
            ->orderByDesc('nama')
            ->get(['id', 'nama', 'is_active']);

        $filters = $this->resolveFilters($request, $academicYears);
        $search = trim((string) $request->input('search', ''));
        $statusFilter = $this->resolveStatusFilter($request->input('status'));

        $semesters = Semester::query()
            ->when(
                $filters['academic_year_id'],
                fn ($query) => $query->where(
                    'academic_year_id',
                    $filters['academic_year_id'],
                ),
            )
            ->orderBy('nama')
            ->get(['id', 'nama', 'academic_year_id', 'is_active']);

        $kelasList = Kelas::query()
            ->with('tingkatan:id,nama')
            ->orderBy('nama')
            ->get(['id', 'nama', 'tingkatan_id']);

        $rows = $this->buildStudentRows($filters, $search, $statusFilter);
        $summary = $this->buildSummary($rows, $filters);

        return [
            'filters' => $filters,
            'search' => $search,
            'statusFilter' => $statusFilter,
            'summary' => $summary,
            'students' => $this->paginateCollection($rows, $request, 15),
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'kelasList' => $kelasList,
            'statusOptions' => $this->getStatusOptions(),
            'warnings' => $this->buildWarnings($filters),
        ];
    }

    /**
     * @param  Collection<int, AcademicYear>  $academicYears
     * @return array<string, int|null>
     */
    private function resolveFilters(Request $request, Collection $academicYears): array
    {
        $academicYearId = $request->filled('academic_year_id')
            ? $request->integer('academic_year_id')
            : ($academicYears->firstWhere('is_active', true)?->id);

        $semesterId = $request->filled('semester_id')
            ? $request->integer('semester_id')
            : null;

        if (! $semesterId && $academicYearId) {
            $semesterId = Semester::query()
                ->where('academic_year_id', $academicYearId)
                ->where('is_active', true)
                ->value('id');
        }

        return [
            'academic_year_id' => $academicYearId,
            'semester_id' => $semesterId,
            'kelas_id' => $request->filled('kelas_id')
                ? $request->integer('kelas_id')
                : null,
        ];
    }

    private function resolveStatusFilter(mixed $status): string
    {
        $allowed = array_column($this->getStatusOptions(), 'value');

        return in_array($status, $allowed, true)
            ? $status
            : self::STATUS_ALL;
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function getStatusOptions(): array
    {
        return [
            ['value' => self::STATUS_ALL, 'label' => 'Semua Status'],
            ['value' => self::STATUS_COMPLETED, 'label' => 'Selesai'],
            ['value' => self::STATUS_IN_PROGRESS, 'label' => 'Sedang Berjalan'],
            ['value' => self::STATUS_PENDING, 'label' => 'Belum Mulai'],
            ['value' => self::STATUS_NO_ASSIGNMENT, 'label' => 'Tanpa Penugasan'],
        ];
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return array<int, string>
     */
    private function buildWarnings(array $filters): array
    {
        $warnings = [];

        if (! $filters['academic_year_id'] || ! $filters['semester_id']) {
            $warnings[] = 'Pilih tahun akademik dan semester untuk melihat pemantauan evaluasi siswa.';
        }

        return $warnings;
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function buildStudentRows(
        array $filters,
        string $search,
        string $statusFilter,
    ): Collection {
        if (! $filters['academic_year_id'] || ! $filters['semester_id']) {
            return collect();
        }

        $assignmentsByKelas = TeachingAssignment::query()
            ->where('academic_year_id', $filters['academic_year_id'])
            ->where('semester_id', $filters['semester_id'])
            ->get(['kelas_id', 'teacher_id'])
            ->groupBy('kelas_id');

        $submittedCounts = Evaluation::query()
            ->select('student_id')
            ->selectRaw('COUNT(*) as total_submitted')
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->where('academic_year_id', $filters['academic_year_id'])
            ->where('semester_id', $filters['semester_id'])
            ->groupBy('student_id')
            ->pluck('total_submitted', 'student_id');

        $draftCounts = Evaluation::query()
            ->select('student_id')
            ->selectRaw('COUNT(*) as total_draft')
            ->where('status', Evaluation::STATUS_DRAFT)
            ->where('academic_year_id', $filters['academic_year_id'])
            ->where('semester_id', $filters['semester_id'])
            ->groupBy('student_id')
            ->pluck('total_draft', 'student_id');

        $students = Student::query()
            ->with(['kelas.tingkatan:id,nama'])
            ->when(
                $filters['kelas_id'],
                fn ($query) => $query->where('kelas_id', $filters['kelas_id']),
            )
            ->when(
                $search !== '',
                fn ($query) => $query->where(function ($builder) use ($search) {
                    $builder->where('nama', 'like', '%'.$search.'%')
                        ->orWhere('nis', 'like', '%'.$search.'%');
                }),
            )
            ->orderBy('nama')
            ->get(['id', 'nama', 'nis', 'kelas_id']);

        return $students
            ->map(function (Student $student) use (
                $assignmentsByKelas,
                $submittedCounts,
                $draftCounts,
            ) {
                $assignments = $assignmentsByKelas->get($student->kelas_id, collect());
                $required = $this->countRequiredEvaluations($assignments);
                $submitted = (int) ($submittedCounts[$student->id] ?? 0);
                $draft = (int) ($draftCounts[$student->id] ?? 0);
                $pending = max($required - $submitted, 0);
                $completionPercentage = $required > 0
                    ? round(($submitted / $required) * 100, 1)
                    : 0.0;

                return [
                    'id' => $student->id,
                    'nama' => $student->nama,
                    'nis' => $student->nis,
                    'kelas' => $student->kelas ? [
                        'id' => $student->kelas->id,
                        'nama' => $student->kelas->nama,
                        'tingkatan' => $student->kelas->tingkatan?->nama,
                    ] : null,
                    'required_evaluations' => $required,
                    'submitted_evaluations' => $submitted,
                    'draft_evaluations' => $draft,
                    'pending_evaluations' => $pending,
                    'completion_percentage' => $completionPercentage,
                    'status' => $this->resolveStudentStatus(
                        $required,
                        $submitted,
                        $draft,
                        $student->kelas_id,
                    ),
                ];
            })
            ->filter(function (array $row) use ($statusFilter) {
                if ($statusFilter === self::STATUS_ALL) {
                    return true;
                }

                return $row['status'] === $statusFilter;
            })
            ->values();
    }

    /**
     * @param  Collection<int, TeachingAssignment>  $assignments
     */
    private function countRequiredEvaluations(Collection $assignments): int
    {
        return $assignments->pluck('teacher_id')->unique()->count();
    }

    private function resolveStudentStatus(
        int $required,
        int $submitted,
        int $draft,
        ?int $kelasId,
    ): string {
        if (! $kelasId || $required === 0) {
            return self::STATUS_NO_ASSIGNMENT;
        }

        if ($submitted >= $required) {
            return self::STATUS_COMPLETED;
        }

        if ($submitted > 0 || $draft > 0) {
            return self::STATUS_IN_PROGRESS;
        }

        return self::STATUS_PENDING;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     * @param  array<string, int|null>  $filters
     * @return array<string, float|int>
     */
    private function buildSummary(Collection $rows, array $filters): array
    {
        if (! $filters['academic_year_id'] || ! $filters['semester_id']) {
            return [
                'total_students' => 0,
                'submitted_evaluations' => 0,
                'pending_evaluations' => 0,
                'completion_percentage' => 0.0,
                'completed_students' => 0,
                'in_progress_students' => 0,
                'pending_students' => 0,
            ];
        }

        $eligibleStudents = $rows->filter(
            fn (array $row) => $row['status'] !== self::STATUS_NO_ASSIGNMENT,
        );

        $totalSubmitted = $rows->sum('submitted_evaluations');
        $totalPending = $rows->sum('pending_evaluations');

        $completedStudents = $rows
            ->where('status', self::STATUS_COMPLETED)
            ->count();

        $completionPercentage = $eligibleStudents->isNotEmpty()
            ? round(
                ($completedStudents / $eligibleStudents->count()) * 100,
                1,
            )
            : 0.0;

        return [
            'total_students' => $rows->count(),
            'submitted_evaluations' => $totalSubmitted,
            'pending_evaluations' => $totalPending,
            'completion_percentage' => $completionPercentage,
            'completed_students' => $completedStudents,
            'in_progress_students' => $rows
                ->where('status', self::STATUS_IN_PROGRESS)
                ->count(),
            'pending_students' => $rows
                ->where('status', self::STATUS_PENDING)
                ->count(),
        ];
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $items
     */
    private function paginateCollection(
        Collection $items,
        Request $request,
        int $perPage,
    ): LengthAwarePaginator {
        $page = max(1, $request->integer('page', 1));

        return new LengthAwarePaginator(
            $items->forPage($page, $perPage)->values(),
            $items->count(),
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ],
        );
    }
}
