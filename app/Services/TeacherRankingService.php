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

class TeacherRankingService
{
    public const TYPE_BEST = 'best';

    public const TYPE_LOWEST = 'lowest';

    public const TYPE_AVERAGE = 'average';

    public const TYPE_SUBJECT = 'subject';

    public const TYPE_CLASS = 'class';

    public const TYPE_ACADEMIC_YEAR = 'academic_year';

    public const TYPE_SEMESTER = 'semester';

    /**
     * @return array<string, mixed>
     */
    public function getData(Request $request): array
    {
        $filterOptions = $this->getFilterOptions();
        $filters = $this->resolveFilters($request, $filterOptions['academicYears']);
        $rankingType = $this->resolveRankingType($request->input('ranking_type'));
        $search = trim((string) $request->input('search', ''));

        $context = $this->buildContext($filters, $rankingType, $filterOptions);
        $rows = $this->getRankingRows($filters, $search, $rankingType);
        $sortedRows = $this->sortRankingRows($rows, $rankingType);
        $rankedRows = $this->applyRankNumbers($sortedRows);

        return [
            'filters' => $filters,
            'search' => $search,
            'rankingType' => $rankingType,
            'context' => $context,
            'podium' => $rankedRows->take(3)->values()->all(),
            'rankings' => $this->paginateCollection($rankedRows, $request, 15),
            'rankingTypes' => $this->getRankingTypeOptions(),
            ...$filterOptions,
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function getRankingTypeOptions(): array
    {
        return [
            ['value' => self::TYPE_BEST, 'label' => 'Guru Terbaik'],
            ['value' => self::TYPE_LOWEST, 'label' => 'Guru Terendah'],
            ['value' => self::TYPE_AVERAGE, 'label' => 'Peringkat Rata-rata'],
            ['value' => self::TYPE_SUBJECT, 'label' => 'Per Mata Pelajaran'],
            ['value' => self::TYPE_CLASS, 'label' => 'Per Kelas'],
            ['value' => self::TYPE_ACADEMIC_YEAR, 'label' => 'Per Tahun Akademik'],
            ['value' => self::TYPE_SEMESTER, 'label' => 'Per Semester'],
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

    private function resolveRankingType(mixed $rankingType): string
    {
        $allowed = array_column($this->getRankingTypeOptions(), 'value');

        return in_array($rankingType, $allowed, true)
            ? $rankingType
            : self::TYPE_AVERAGE;
    }

    /**
     * @param  array<string, mixed>  $filterOptions
     * @param  array<string, int|null>  $filters
     * @return array<string, mixed>
     */
    private function buildContext(
        array $filters,
        string $rankingType,
        array $filterOptions,
    ): array {
        $warnings = [];
        $scopeLabel = 'Seluruh evaluasi yang difilter';

        if ($rankingType === self::TYPE_SUBJECT) {
            if ($filters['subject_id']) {
                $subject = collect($filterOptions['subjects'])
                    ->firstWhere('id', $filters['subject_id']);
                $scopeLabel = 'Mata pelajaran: '.($subject?->nama ?? '—');
            } else {
                $warnings[] = 'Pilih mata pelajaran untuk melihat peringkat guru per mapel.';
            }
        }

        if ($rankingType === self::TYPE_CLASS) {
            if ($filters['kelas_id']) {
                $kelas = collect($filterOptions['kelasList'])
                    ->firstWhere('id', $filters['kelas_id']);
                $label = $kelas?->nama ?? '—';

                if ($kelas?->tingkatan?->nama) {
                    $label .= ' ('.$kelas->tingkatan->nama.')';
                }

                $scopeLabel = 'Kelas: '.$label;
            } else {
                $warnings[] = 'Pilih kelas untuk melihat peringkat guru per kelas.';
            }
        }

        if ($rankingType === self::TYPE_ACADEMIC_YEAR) {
            if ($filters['academic_year_id']) {
                $year = collect($filterOptions['academicYears'])
                    ->firstWhere('id', $filters['academic_year_id']);
                $scopeLabel = 'Tahun akademik: '.($year?->nama ?? '—');
            } else {
                $warnings[] = 'Pilih tahun akademik untuk melihat peringkat guru.';
            }
        }

        if ($rankingType === self::TYPE_SEMESTER) {
            if ($filters['semester_id']) {
                $semester = collect($filterOptions['semesters'])
                    ->firstWhere('id', $filters['semester_id']);
                $scopeLabel = 'Semester: '.($semester?->nama ?? '—');
            } else {
                $warnings[] = 'Pilih semester untuk melihat peringkat guru per semester.';
            }
        }

        if ($rankingType === self::TYPE_BEST) {
            $scopeLabel = 'Guru dengan rata-rata skor tertinggi';
        }

        if ($rankingType === self::TYPE_LOWEST) {
            $scopeLabel = 'Guru dengan rata-rata skor terendah';
        }

        if ($rankingType === self::TYPE_AVERAGE) {
            $scopeLabel = 'Peringkat guru berdasarkan rata-rata skor evaluasi';
        }

        return [
            'scope_label' => $scopeLabel,
            'warnings' => $warnings,
        ];
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return Collection<int, array<string, mixed>>
     */
    private function getRankingRows(
        array $filters,
        string $search,
        string $rankingType,
    ): Collection {
        if ($rankingType === self::TYPE_SUBJECT && ! $filters['subject_id']) {
            return collect();
        }

        if ($rankingType === self::TYPE_CLASS && ! $filters['kelas_id']) {
            return collect();
        }

        if ($rankingType === self::TYPE_ACADEMIC_YEAR && ! $filters['academic_year_id']) {
            return collect();
        }

        if ($rankingType === self::TYPE_SEMESTER && ! $filters['semester_id']) {
            return collect();
        }

        $scopedFilters = $this->applyRankingScopeFilters($filters, $rankingType);

        $query = $rankingType === self::TYPE_SUBJECT
            ? $this->assignmentScopedQuery($scopedFilters)
                ->join('teachers', 'teachers.id', '=', 'evaluations.teacher_id')
            : $this->baseEvaluationQuery($scopedFilters)
                ->join('teachers', 'teachers.id', '=', 'evaluations.teacher_id');

        $query
            ->select('teachers.id as teacher_id', 'teachers.nama as teacher_name')
            ->selectRaw('AVG(evaluations.average_score) as average_score')
            ->selectRaw('MAX(evaluations.average_score) as highest_score')
            ->selectRaw('MIN(evaluations.average_score) as lowest_score')
            ->selectRaw('COUNT(*) as total_responses')
            ->groupBy('teachers.id', 'teachers.nama');

        if ($search !== '') {
            $query->where('teachers.nama', 'like', '%'.$search.'%');
        }

        return $query->get()->map(fn ($row) => [
            'teacher_id' => $row->teacher_id,
            'teacher_name' => $row->teacher_name,
            'average_score' => $this->roundScore($row->average_score),
            'highest_score' => $this->roundScore($row->highest_score),
            'lowest_score' => $this->roundScore($row->lowest_score),
            'total_responses' => (int) $row->total_responses,
        ]);
    }

    /**
     * @param  array<string, int|null>  $filters
     * @return array<string, int|null>
     */
    private function applyRankingScopeFilters(array $filters, string $rankingType): array
    {
        $scoped = $filters;

        if ($rankingType === self::TYPE_ACADEMIC_YEAR) {
            $scoped['semester_id'] = null;
        }

        if ($rankingType === self::TYPE_SEMESTER && $filters['semester_id']) {
            $semester = Semester::query()->find($filters['semester_id']);
            $scoped['academic_year_id'] = $semester?->academic_year_id;
        }

        return $scoped;
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     * @return Collection<int, array<string, mixed>>
     */
    private function sortRankingRows(Collection $rows, string $rankingType): Collection
    {
        if ($rankingType === self::TYPE_LOWEST) {
            return $rows->sortBy([
                ['average_score', 'asc'],
                ['teacher_name', 'asc'],
            ])->values();
        }

        return $rows->sortBy([
            ['average_score', 'desc'],
            ['total_responses', 'desc'],
            ['teacher_name', 'asc'],
        ])->values();
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $rows
     * @return Collection<int, array<string, mixed>>
     */
    private function applyRankNumbers(Collection $rows): Collection
    {
        return $rows->values()->map(function (array $row, int $index) {
            $row['rank'] = $index + 1;

            return $row;
        });
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
    private function assignmentScopedQuery(array $filters): \Illuminate\Database\Query\Builder
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
