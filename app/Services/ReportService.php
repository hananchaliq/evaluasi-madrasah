<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SubjectCategory;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReportService
{
    public const TYPE_TEACHER = 'teacher';

    public const TYPE_CLASS = 'class';

    public const TYPE_SUBJECT = 'subject';

    public const TYPE_CATEGORY = 'category';

    public const TYPE_EVALUATION_PERIOD = 'evaluation_period';

    public function __construct(
        private readonly AnalyticsService $analyticsService,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function getTeacherReport(Request $request): array
    {
        return $this->buildStatisticsReport(
            $request,
            AnalyticsService::GROUP_TEACHER,
            self::TYPE_TEACHER,
            'Laporan Guru',
            'Laporan statistik evaluasi pembelajaran per guru.',
            'reports.teacher',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getClassReport(Request $request): array
    {
        return $this->buildStatisticsReport(
            $request,
            AnalyticsService::GROUP_CLASS,
            self::TYPE_CLASS,
            'Laporan Kelas',
            'Laporan statistik evaluasi pembelajaran per kelas.',
            'reports.class',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getSubjectReport(Request $request): array
    {
        return $this->buildStatisticsReport(
            $request,
            AnalyticsService::GROUP_SUBJECT,
            self::TYPE_SUBJECT,
            'Laporan Mata Pelajaran',
            'Laporan statistik evaluasi pembelajaran per mata pelajaran.',
            'reports.subject',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getCategoryReport(Request $request): array
    {
        return $this->buildStatisticsReport(
            $request,
            AnalyticsService::GROUP_CATEGORY,
            self::TYPE_CATEGORY,
            'Laporan Kategori',
            'Laporan statistik evaluasi pembelajaran per kategori mata pelajaran.',
            'reports.category',
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function getEvaluationPeriodReport(Request $request): array
    {
        $filterOptions = $this->getFilterOptions();
        $filters = $this->resolveEvaluationPeriodFilters(
            $request,
            $filterOptions['academicYears'],
        );
        $search = trim((string) $request->input('search', ''));

        $periodQuery = EvaluationPeriod::query()
            ->with(['academicYear:id,nama', 'semester:id,nama'])
            ->when(
                $filters['academic_year_id'],
                fn ($query) => $query->where(
                    'academic_year_id',
                    $filters['academic_year_id'],
                ),
            )
            ->when(
                $filters['semester_id'],
                fn ($query) => $query->where(
                    'semester_id',
                    $filters['semester_id'],
                ),
            )
            ->when(
                $filters['evaluation_period_id'],
                fn ($query) => $query->where(
                    'id',
                    $filters['evaluation_period_id'],
                ),
            )
            ->when(
                $search !== '',
                fn ($query) => $query->where('nama', 'like', '%'.$search.'%'),
            )
            ->orderByDesc('start_date')
            ->orderByDesc('id');

        $periods = $periodQuery->get();
        $rows = $periods->map(fn (EvaluationPeriod $period) => $this->mapEvaluationPeriodRow($period));
        $statistics = $this->paginateCollection($rows, $request, 15);

        $periodIds = $periods->pluck('id');

        $summaryQuery = Evaluation::query()
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->whereNotNull('average_score')
            ->when(
                $periodIds->isNotEmpty(),
                fn ($query) => $query->whereIn('evaluation_period_id', $periodIds),
                fn ($query) => $query->whereRaw('1 = 0'),
            );

        return [
            'reportType' => self::TYPE_EVALUATION_PERIOD,
            'report' => $this->buildReportMeta(
                self::TYPE_EVALUATION_PERIOD,
                'Laporan Periode Evaluasi',
                'Laporan statistik evaluasi pembelajaran per periode evaluasi.',
                'reports.evaluation-period',
            ),
            'filters' => $filters,
            'search' => $search,
            'summary' => [
                'average_score' => $this->roundScore($summaryQuery->avg('average_score')),
                'highest_score' => $this->roundScore($summaryQuery->max('average_score')),
                'lowest_score' => $this->roundScore($summaryQuery->min('average_score')),
                'total_responses' => (int) (clone $summaryQuery)->count(),
            ],
            'statistics' => $statistics,
            'filterLabels' => $this->buildFilterLabels($filters, $filterOptions),
            ...$filterOptions,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function buildStatisticsReport(
        Request $request,
        string $groupBy,
        string $reportType,
        string $title,
        string $description,
        string $routeName,
    ): array {
        $data = $this->analyticsService->getStatisticsReport($request, $groupBy);

        return [
            'reportType' => $reportType,
            'report' => $this->buildReportMeta($reportType, $title, $description, $routeName),
            'filterLabels' => $this->buildFilterLabels($data['filters'], $data),
            ...$data,
        ];
    }

    /**
     * @return array<string, string>
     */
    private function buildReportMeta(
        string $type,
        string $title,
        string $description,
        string $routeName,
    ): array {
        return [
            'type' => $type,
            'title' => $title,
            'description' => $description,
            'routeName' => $routeName,
            'institution' => 'Madrasah Aliyah Kejuruan Negeri Ende (MAKN Ende)',
            'generatedAt' => now()->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getFilterOptions(): array
    {
        return [
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama', 'is_active']),
            'semesters' => Semester::query()
                ->orderBy('nama')
                ->get(['id', 'nama', 'academic_year_id', 'is_active']),
            'teachers' => Teacher::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
            'kelasList' => Kelas::query()
                ->with('tingkatan:id,nama')
                ->orderBy('nama')
                ->get(['id', 'nama', 'tingkatan_id']),
            'subjects' => Subject::query()
                ->with('subjectCategory:id,nama')
                ->orderBy('nama')
                ->get(['id', 'nama', 'subject_category_id']),
            'subjectCategories' => SubjectCategory::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
            'evaluationPeriods' => EvaluationPeriod::query()
                ->with(['academicYear:id,nama', 'semester:id,nama'])
                ->orderByDesc('start_date')
                ->orderByDesc('id')
                ->get(['id', 'nama', 'academic_year_id', 'semester_id', 'start_date', 'end_date']),
        ];
    }

    /**
     * @param  Collection<int, AcademicYear>  $academicYears
     * @return array<string, int|null>
     */
    private function resolveEvaluationPeriodFilters(
        Request $request,
        Collection $academicYears,
    ): array {
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
            'evaluation_period_id' => $request->filled('evaluation_period_id')
                ? $request->integer('evaluation_period_id')
                : null,
            'teacher_id' => null,
            'kelas_id' => null,
            'subject_id' => null,
            'subject_category_id' => null,
        ];
    }

    /**
     * @param  array<string, mixed>  $filters
     * @param  array<string, mixed>  $options
     * @return array<int, array<string, string>>
     */
    private function buildFilterLabels(array $filters, array $options): array
    {
        $labels = [];

        if ($filters['academic_year_id'] ?? null) {
            $year = collect($options['academicYears'] ?? [])
                ->firstWhere('id', $filters['academic_year_id']);

            $labels[] = [
                'label' => 'Tahun Akademik',
                'value' => $year?->nama ?? '-',
            ];
        }

        if ($filters['semester_id'] ?? null) {
            $semester = collect($options['semesters'] ?? [])
                ->firstWhere('id', $filters['semester_id']);

            $labels[] = [
                'label' => 'Semester',
                'value' => $semester?->nama ?? '-',
            ];
        }

        if ($filters['teacher_id'] ?? null) {
            $teacher = collect($options['teachers'] ?? [])
                ->firstWhere('id', $filters['teacher_id']);

            $labels[] = [
                'label' => 'Guru',
                'value' => $teacher?->nama ?? '-',
            ];
        }

        if ($filters['kelas_id'] ?? null) {
            $kelas = collect($options['kelasList'] ?? [])
                ->firstWhere('id', $filters['kelas_id']);

            $labels[] = [
                'label' => 'Kelas',
                'value' => $kelas?->nama ?? '-',
            ];
        }

        if ($filters['subject_id'] ?? null) {
            $subject = collect($options['subjects'] ?? [])
                ->firstWhere('id', $filters['subject_id']);

            $labels[] = [
                'label' => 'Mata Pelajaran',
                'value' => $subject?->nama ?? '-',
            ];
        }

        if ($filters['subject_category_id'] ?? null) {
            $category = collect($options['subjectCategories'] ?? [])
                ->firstWhere('id', $filters['subject_category_id']);

            $labels[] = [
                'label' => 'Kategori Mapel',
                'value' => $category?->nama ?? '-',
            ];
        }

        if ($filters['evaluation_period_id'] ?? null) {
            $period = collect($options['evaluationPeriods'] ?? [])
                ->firstWhere('id', $filters['evaluation_period_id']);

            $labels[] = [
                'label' => 'Periode Evaluasi',
                'value' => $period?->nama ?? '-',
            ];
        }

        if ($labels === []) {
            $labels[] = [
                'label' => 'Filter',
                'value' => 'Semua data evaluasi',
            ];
        }

        return $labels;
    }

    /**
     * @return array<string, mixed>
     */
    private function mapEvaluationPeriodRow(EvaluationPeriod $period): array
    {
        $submittedQuery = Evaluation::query()
            ->where('evaluation_period_id', $period->id)
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->whereNotNull('average_score');

        $totalResponses = (int) (clone $submittedQuery)->count();
        $expectedResponses = $this->calculateExpectedEvaluations(
            $period->academic_year_id,
            $period->semester_id,
        );

        return [
            'entity_id' => $period->id,
            'label' => $period->nama,
            'academic_year' => $period->academicYear?->nama,
            'semester' => $period->semester?->nama,
            'start_date' => $period->start_date->format('Y-m-d'),
            'end_date' => $period->end_date->format('Y-m-d'),
            'is_active' => $period->is_active,
            'is_locked' => $period->is_locked,
            'average_score' => $this->roundScore($submittedQuery->avg('average_score')),
            'highest_score' => $this->roundScore($submittedQuery->max('average_score')),
            'lowest_score' => $this->roundScore($submittedQuery->min('average_score')),
            'total_responses' => $totalResponses,
            'expected_responses' => $expectedResponses,
            'response_rate' => $expectedResponses > 0
                ? round(($totalResponses / $expectedResponses) * 100, 1)
                : null,
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

        return (int) $students->sum(function (Student $student) use ($assignmentsByKelas) {
            return $assignmentsByKelas->get($student->kelas_id)?->count() ?? 0;
        });
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

    private function roundScore(mixed $value): ?float
    {
        if ($value === null) {
            return null;
        }

        return round((float) $value, 2);
    }
}
