<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Models\AcademicYear;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index(Request $request): Response
    {
        $academicYears = AcademicYear::query()
            ->withCount('semesters')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where('nama', 'like', '%'.$request->string('search').'%'),
            )
            ->orderByDesc('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/AcademicYears/Index', [
            'academicYears' => $academicYears,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new academic year.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/AcademicYears/Create');
    }

    /**
     * Store a newly created academic year.
     */
    public function store(StoreAcademicYearRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            if ($request->boolean('is_active')) {
                AcademicYear::query()->update(['is_active' => false]);
            }

            AcademicYear::create($request->validated());
        });

        return redirect()
            ->route('admin.academic-years.index')
            ->with('success', 'Tahun akademik berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified academic year.
     */
    public function edit(AcademicYear $academicYear): Response
    {
        return Inertia::render('Admin/AcademicYears/Edit', [
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Update the specified academic year.
     */
    public function update(UpdateAcademicYearRequest $request, AcademicYear $academicYear): RedirectResponse
    {
        DB::transaction(function () use ($request, $academicYear) {
            if ($request->boolean('is_active')) {
                AcademicYear::query()
                    ->whereKeyNot($academicYear->id)
                    ->update(['is_active' => false]);
            }

            $academicYear->update($request->validated());
        });

        return redirect()
            ->route('admin.academic-years.index')
            ->with('success', 'Tahun akademik berhasil diperbarui.');
    }

    /**
     * Remove the specified academic year.
     */
    public function destroy(AcademicYear $academicYear): RedirectResponse
    {
        if ($this->hasRelatedData($academicYear)) {
            return redirect()
                ->route('admin.academic-years.index')
                ->with('error', 'Tahun akademik tidak dapat dihapus karena masih memiliki data terkait.');
        }

        $academicYear->delete();

        return redirect()
            ->route('admin.academic-years.index')
            ->with('success', 'Tahun akademik berhasil dihapus.');
    }

    private function hasRelatedData(AcademicYear $academicYear): bool
    {
        return $academicYear->semesters()->exists()
            || $academicYear->evaluationPeriods()->exists()
            || $academicYear->teachingAssignments()->exists()
            || $academicYear->evaluations()->exists();
    }
}
