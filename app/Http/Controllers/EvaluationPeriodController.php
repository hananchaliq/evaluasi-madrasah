<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationPeriodRequest;
use App\Http\Requests\UpdateEvaluationPeriodRequest;
use App\Models\AcademicYear;
use App\Models\EvaluationPeriod;
use App\Models\Semester;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationPeriodController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * Display a listing of evaluation periods.
     */
    public function index(Request $request): Response
    {
        $evaluationPeriods = EvaluationPeriod::query()
            ->with([
                'academicYear:id,nama',
                'semester:id,nama,academic_year_id',
            ])
            ->withCount('evaluations')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(function ($builder) use ($request) {
                    $search = $request->string('search');

                    $builder->where('nama', 'like', '%'.$search.'%')
                        ->orWhereHas('academicYear', fn ($yearQuery) => $yearQuery->where('nama', 'like', '%'.$search.'%'))
                        ->orWhereHas('semester', fn ($semesterQuery) => $semesterQuery->where('nama', 'like', '%'.$search.'%'));
                }),
            )
            ->when(
                $request->filled('academic_year_id'),
                fn ($query) => $query->where('academic_year_id', $request->integer('academic_year_id')),
            )
            ->when(
                $request->filled('semester_id'),
                fn ($query) => $query->where('semester_id', $request->integer('semester_id')),
            )
            ->when(
                $request->filled('is_active') && $request->string('is_active') !== '',
                fn ($query) => $query->where(
                    'is_active',
                    $request->string('is_active') === '1',
                ),
            )
            ->orderByDesc('start_date')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('EvaluationPeriods/Index', [
            'evaluationPeriods' => $evaluationPeriods,
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
            'semesters' => Semester::query()
                ->orderBy('nama')
                ->get(['id', 'nama', 'academic_year_id']),
            'filters' => $request->only([
                'search',
                'academic_year_id',
                'semester_id',
                'is_active',
            ]),
        ]);
    }

    /**
     * Show the form for creating a new evaluation period.
     */
    public function create(): Response
    {
        return Inertia::render('EvaluationPeriods/Create', [
            ...$this->getFormOptions(),
        ]);
    }

    /**
     * Store a newly created evaluation period.
     */
    public function store(StoreEvaluationPeriodRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            if ($request->boolean('is_active')) {
                EvaluationPeriod::query()->update(['is_active' => false]);
            }

            EvaluationPeriod::create($request->validated());
        });

        $this->notificationService->syncNotifications();

        return redirect()
            ->route('evaluation-periods.index')
            ->with('success', 'Periode evaluasi berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified evaluation period.
     */
    public function edit(EvaluationPeriod $evaluationPeriod): Response
    {
        return Inertia::render('EvaluationPeriods/Edit', [
            'evaluationPeriod' => $evaluationPeriod->load([
                'academicYear:id,nama',
                'semester:id,nama,academic_year_id',
            ]),
            ...$this->getFormOptions(),
        ]);
    }

    /**
     * Update the specified evaluation period.
     */
    public function update(
        UpdateEvaluationPeriodRequest $request,
        EvaluationPeriod $evaluationPeriod,
    ): RedirectResponse {
        DB::transaction(function () use ($request, $evaluationPeriod) {
            if ($request->boolean('is_active')) {
                EvaluationPeriod::query()
                    ->whereKeyNot($evaluationPeriod->id)
                    ->update(['is_active' => false]);
            }

            $evaluationPeriod->update($request->validated());
        });

        $this->notificationService->syncNotifications();

        return redirect()
            ->route('evaluation-periods.index')
            ->with('success', 'Periode evaluasi berhasil diperbarui.');
    }

    /**
     * Remove the specified evaluation period.
     */
    public function destroy(EvaluationPeriod $evaluationPeriod): RedirectResponse
    {
        if ($evaluationPeriod->evaluations()->exists()) {
            return redirect()
                ->route('evaluation-periods.index')
                ->with('error', 'Periode evaluasi tidak dapat dihapus karena masih memiliki data evaluasi.');
        }

        $evaluationPeriod->delete();

        return redirect()
            ->route('evaluation-periods.index')
            ->with('success', 'Periode evaluasi berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function getFormOptions(): array
    {
        return [
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
            'semesters' => Semester::query()
                ->orderBy('nama')
                ->get(['id', 'nama', 'academic_year_id']),
        ];
    }
}
