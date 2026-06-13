<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;
use App\Models\AcademicYear;
use App\Models\Semester;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SemesterController extends Controller
{
    /**
     * Display a listing of semesters.
     */
    public function index(Request $request): Response
    {
        $semesters = Semester::query()
            ->with('academicYear:id,nama')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(function ($builder) use ($request) {
                    $builder->where('nama', 'like', '%'.$request->string('search').'%')
                        ->orWhereHas('academicYear', fn ($yearQuery) => $yearQuery->where('nama', 'like', '%'.$request->string('search').'%'));
                }),
            )
            ->when(
                $request->filled('academic_year_id'),
                fn ($query) => $query->where('academic_year_id', $request->integer('academic_year_id')),
            )
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Semesters/Index', [
            'semesters' => $semesters,
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
            'filters' => $request->only(['search', 'academic_year_id']),
        ]);
    }

    /**
     * Show the form for creating a new semester.
     */
    public function create(): Response
    {
        return Inertia::render('Semesters/Create', [
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
        ]);
    }

    /**
     * Store a newly created semester.
     */
    public function store(StoreSemesterRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            if ($request->boolean('is_active')) {
                Semester::query()->update(['is_active' => false]);
            }

            Semester::create($request->validated());
        });

        return redirect()
            ->route('semesters.index')
            ->with('success', 'Semester berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified semester.
     */
    public function edit(Semester $semester): Response
    {
        return Inertia::render('Semesters/Edit', [
            'semester' => $semester->load('academicYear:id,nama'),
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
        ]);
    }

    /**
     * Update the specified semester.
     */
    public function update(UpdateSemesterRequest $request, Semester $semester): RedirectResponse
    {
        DB::transaction(function () use ($request, $semester) {
            if ($request->boolean('is_active')) {
                Semester::query()
                    ->whereKeyNot($semester->id)
                    ->update(['is_active' => false]);
            }

            $semester->update($request->validated());
        });

        return redirect()
            ->route('semesters.index')
            ->with('success', 'Semester berhasil diperbarui.');
    }

    /**
     * Remove the specified semester.
     */
    public function destroy(Semester $semester): RedirectResponse
    {
        if ($this->hasRelatedData($semester)) {
            return redirect()
                ->route('semesters.index')
                ->with('error', 'Semester tidak dapat dihapus karena masih memiliki data terkait.');
        }

        $semester->delete();

        return redirect()
            ->route('semesters.index')
            ->with('success', 'Semester berhasil dihapus.');
    }

    private function hasRelatedData(Semester $semester): bool
    {
        return $semester->evaluationPeriods()->exists()
            || $semester->teachingAssignments()->exists()
            || $semester->evaluations()->exists();
    }
}
