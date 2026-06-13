<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\SubjectCategory;
use App\Models\Teacher;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public const GROUP_TEACHER = 'teacher';

    public const GROUP_CLASS = 'class';

    public const GROUP_SUBJECT = 'subject';

    public const GROUP_CATEGORY = 'category';

    public const GROUP_ACADEMIC_YEAR = 'academic_year';

    public const GROUP_SEMESTER = 'semester';

    /**
     * @return array<string, mixed>
     */
    public function getData(Request $request): array
    {
        $filterOptions = $this->getFilterOptions();
        $filters = $this->resolveFilters($request, $filterOptions['academicYears']);
        $groupBy = $this->resolveGroupBy($request->input('group_by'));
        $search = trim((string) $request->input('search', ''));

        $summary = $this->getSummaryMetrics($filters);
        $statistics = $this->getGroupedStatistics($filters, $groupBy, $search, $request);
        $rankings = $this->getTeacherRankings($filters);

        return [
            'filters' => $filters,
            'search' => $search,
            'groupBy' => $groupBy,
            'summary' => $summary,
            'statistics' => $statistics,
            'rankings' => $rankings,
            ...$filterOptions,
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
            'teacher_id' => $request->filled('teacher_id')
                ? $request->integer('teacher_id')
                : null,
            'kelas_id' => $request->filled('kelas_id')
                ? $request->integer('kelas_id')
                : null,
            'subject_id' => $request->filled('subject_id')
                ? $request->integer('subject_id')
                : null,
            'subject_category_id' => $request->filled('subject_category_id')
                ? $request->integer('subject_category_id')
                : null,
        ];
    }

    private function resolveGroupBy(mixed $groupBy): string
    {
        $allowed = [
            self::GROUP_TEACHER,
            self::GROUP_CLASS,
            self::GROUP_SUBJECT,
            self::GROUP_CATEGORY,
            self::GROUP_ACADEMIC_YEAR,
            self::GROUP_SEMESTER,
        ];

        return in_array($groupBy, $allowed, true)
            ? $groupBy
            : self::GROUP_TEACHER;
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return array<string, float|int|null>
     */
    private function getSummaryMetrics(array $filters): array
    {
        $query = $this->baseEvaluationQuery($filters);

        return [
            'average_score' => $this->roundScore($query->avg('evaluations.average_score')),
            'highest_score' => $this->roundScore($query->max('evaluations.average_score')),
            'lowest_score' => $this->roundScore($query->min('evaluations.average_score')),
            'total_responses' => (int) (clone $query)->count('evaluations.id'),
        ];
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return array<string, mixed>
     */
    private function getTeacherRankings(array $filters): array
    {
        $rows = $this->baseEvaluationQuery($filters)
            ->join('teachers', 'teachers.id', '=', 'evaluations.teacher_id')
            ->select('teachers.id', 'teachers.nama')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('teachers.id', 'teachers.nama')
            ->orderByDesc('average_score')
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'label' => $row->nama,
                'average_score' => $this->roundScore($row->average_score),
                'highest_score' => $this->roundScore($row->highest_score),
                'lowest_score' => $this->roundScore($row->lowest_score),
                'total_responses' => (int) $row->total_responses,
            ]);

        return [
            'best' => $rows->take(5)->values()->all(),
            'lowest' => $rows->sortBy('average_score')->take(5)->values()->all(),
            'average' => $rows->sortByDesc('total_responses')->take(5)->values()->all(),
        ];
    }

    /**
     * @param  array<string, int|null>  $filters
     */
    private function getGroupedStatistics(
        array $filters,
        string $groupBy,
        string $search,
        Request $request,
    ): LengthAwarePaginator {
        $rows = match ($groupBy) {
            self::GROUP_CLASS => $this->getClassStatistics($filters, $search),
            self::GROUP_SUBJECT => $this->getSubjectStatistics($filters, $search),
            self::GROUP_CATEGORY => $this->getCategoryStatistics($filters, $search),
            self::GROUP_ACADEMIC_YEAR => $this->getAcademicYearStatistics($filters, $search),
            self::GROUP_SEMESTER => $this->getSemesterStatistics($filters, $search),
            default => $this->getTeacherStatistics($filters, $search),
        };

        return $this->paginateCollection($rows, $request, 15);
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getTeacherStatistics(array $filters, string $search): Collection
    {
        $query = $this->baseEvaluationQuery($filters)
            ->join('teachers', 'teachers.id', '=', 'evaluations.teacher_id')
            ->select('teachers.id as entity_id', 'teachers.nama as label')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('teachers.id', 'teachers.nama')
            ->orderByDesc('average_score');

        if ($search !== '') {
            $query->where('teachers.nama', 'like', '%'.$search.'%');
        }

        return $this->mapStatisticRows($query->get());
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getClassStatistics(array $filters, string $search): Collection
    {
        $query = $this->baseEvaluationQuery($filters)
            ->join('students', 'students.id', '=', 'evaluations.student_id')
            ->join('kelas', 'kelas.id', '=', 'students.kelas_id')
            ->leftJoin('tingkatans', 'tingkatans.id', '=', 'kelas.tingkatan_id')
            ->whereNotNull('students.kelas_id')
            ->select('kelas.id as entity_id')
            ->selectRaw("CONCAT(kelas.nama, IF(tingkatans.nama IS NULL, '', CONCAT(' (', tingkatans.nama, ')'))) as label")
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('kelas.id', 'kelas.nama', 'tingkatans.nama')
            ->orderByDesc('average_score');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('kelas.nama', 'like', '%'.$search.'%')
                    ->orWhere('tingkatans.nama', 'like', '%'.$search.'%');
            });
        }

        return $this->mapStatisticRows($query->get());
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getSubjectStatistics(array $filters, string $search): Collection
    {
        $query = $this->assignmentScopedQuery($filters)
            ->join('subjects', 'subjects.id', '=', 'teaching_assignments.subject_id')
            ->select('subjects.id as entity_id', 'subjects.nama as label')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('subjects.id', 'subjects.nama')
            ->orderByDesc('average_score');

        if ($search !== '') {
            $query->where('subjects.nama', 'like', '%'.$search.'%');
        }

        return $this->mapStatisticRows($query->get());
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getCategoryStatistics(array $filters, string $search): Collection
    {
        $query = $this->assignmentScopedQuery($filters)
            ->join('subjects', 'subjects.id', '=', 'teaching_assignments.subject_id')
            ->join('subject_categories', 'subject_categories.id', '=', 'subjects.subject_category_id')
            ->select('subject_categories.id as entity_id', 'subject_categories.nama as label')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('subject_categories.id', 'subject_categories.nama')
            ->orderByDesc('average_score');

        if ($search !== '') {
            $query->where('subject_categories.nama', 'like', '%'.$search.'%');
        }

        return $this->mapStatisticRows($query->get());
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getAcademicYearStatistics(array $filters, string $search): Collection
    {
        $query = $this->baseEvaluationQuery($filters)
            ->join('academic_years', 'academic_years.id', '=', 'evaluations.academic_year_id')
            ->select('academic_years.id as entity_id', 'academic_years.nama as label')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('academic_years.id', 'academic_years.nama')
            ->orderByDesc('academic_years.nama');

        if ($search !== '') {
            $query->where('academic_years.nama', 'like', '%'.$search.'%');
        }

        return $this->mapStatisticRows($query->get());
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getSemesterStatistics(array $filters, string $search): Collection
    {
        $query = $this->baseEvaluationQuery($filters)
            ->join('semesters', 'semesters.id', '=', 'evaluations.semester_id')
            ->join('academic_years', 'academic_years.id', '=', 'semesters.academic_year_id')
            ->select('semesters.id as entity_id')
            ->selectRaw("CONCAT(semesters.nama, ' - ', academic_years.nama) as label")
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('semesters.id', 'semesters.nama', 'academic_years.nama')
            ->orderByDesc('academic_years.nama')
            ->orderBy('semesters.nama');

        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('semesters.nama', 'like', '%'.$search.'%')
                    ->orWhere('academic_years.nama', 'like', '%'.$search.'%');
            });
        }

        return $this->mapStatisticRows($query->get());
    }

    /**
     * @param  array<string, int|null>  $filters
     */
    private function baseEvaluationQuery(array $filters): Builder
    {
        return Evaluation::query()
            ->where('evaluations.status', Evaluation::STATUS_SUBMITTED)
            ->whereNotNull('evaluations.average_score')
            ->when(
                $filters['academic_year_id'],
                fn (Builder $query) => $query->where(
                    'evaluations.academic_year_id',
                    $filters['academic_year_id'],
                ),
            )
            ->when(
                $filters['semester_id'],
                fn (Builder $query) => $query->where(
                    'evaluations.semester_id',
                    $filters['semester_id'],
                ),
            )
            ->when(
                $filters['teacher_id'],
                fn (Builder $query) => $query->where(
                    'evaluations.teacher_id',
                    $filters['teacher_id'],
                ),
            )
            ->when(
                $filters['kelas_id'],
                fn (Builder $query) => $query->whereHas(
                    'student',
                    fn (Builder $studentQuery) => $studentQuery->where(
                        'kelas_id',
                        $filters['kelas_id'],
                    ),
                ),
            )
            ->when(
                $filters['subject_id'] || $filters['subject_category_id'],
                fn (Builder $query) => $query->whereExists(function ($subQuery) use ($filters) {
                    $subQuery->select(DB::raw(1))
                        ->from('students')
                        ->join('teaching_assignments', function ($join) {
                            $join->on('teaching_assignments.teacher_id', '=', 'evaluations.teacher_id')
                                ->on('teaching_assignments.academic_year_id', '=', 'evaluations.academic_year_id')
                                ->on('teaching_assignments.semester_id', '=', 'evaluations.semester_id')
                                ->on('teaching_assignments.kelas_id', '=', 'students.kelas_id');
                        })
                        ->join('subjects', 'subjects.id', '=', 'teaching_assignments.subject_id')
                        ->whereColumn('students.id', 'evaluations.student_id');

                    if ($filters['subject_id']) {
                        $subQuery->where('subjects.id', $filters['subject_id']);
                    }

                    if ($filters['subject_category_id']) {
                        $subQuery->where(
                            'subjects.subject_category_id',
                            $filters['subject_category_id'],
                        );
                    }
                }),
            );
    }

    /**
     * @param  array<string, int|null>  $filters
     */
    private function assignmentScopedQuery(array $filters): Builder
    {
        return DB::query()
            ->from('evaluations')
            ->join('students', 'students.id', '=', 'evaluations.student_id')
            ->join('teaching_assignments', function ($join) {
                $join->on('teaching_assignments.teacher_id', '=', 'evaluations.teacher_id')
                    ->on('teaching_assignments.academic_year_id', '=', 'evaluations.academic_year_id')
                    ->on('teaching_assignments.semester_id', '=', 'evaluations.semester_id')
                    ->on('teaching_assignments.kelas_id', '=', 'students.kelas_id');
            })
            ->where('evaluations.status', Evaluation::STATUS_SUBMITTED)
            ->whereNotNull('evaluations.average_score')
            ->when(
                $filters['academic_year_id'],
                fn ($query) => $query->where(
                    'evaluations.academic_year_id',
                    $filters['academic_year_id'],
                ),
            )
            ->when(
                $filters['semester_id'],
                fn ($query) => $query->where(
                    'evaluations.semester_id',
                    $filters['semester_id'],
                ),
            )
            ->when(
                $filters['teacher_id'],
                fn ($query) => $query->where(
                    'evaluations.teacher_id',
                    $filters['teacher_id'],
                ),
            )
            ->when(
                $filters['kelas_id'],
                fn ($query) => $query->where('students.kelas_id', $filters['kelas_id']),
            )
            ->when(
                $filters['subject_id'],
                fn ($query) => $query->where(
                    'teaching_assignments.subject_id',
                    $filters['subject_id'],
                ),
            )
            ->when(
                $filters['subject_category_id'],
                fn ($query) => $query->whereExists(function ($subQuery) use ($filters) {
                    $subQuery->select(DB::raw(1))
                        ->from('subjects')
                        ->whereColumn('subjects.id', 'teaching_assignments.subject_id')
                        ->where('subjects.subject_category_id', $filters['subject_category_id']);
                }),
            );
    }

    /**
     * @param  Collection<int, object>  $rows
     * @return Collection<int, array<string, mixed>>
     */
    private function mapStatisticRows(Collection $rows): Collection
    {
        return $rows->map(fn ($row) => [
            'entity_id' => $row->entity_id,
            'label' => $row->label,
            'average_score' => $this->roundScore($row->average_score),
            'highest_score' => $this->roundScore($row->highest_score),
            'lowest_score' => $this->roundScore($row->lowest_score),
            'total_responses' => (int) $row->total_responses,
        ]);
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
