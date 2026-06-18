<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreTeachingAssignmentRequest;
use App\Http\Requests\UpdateTeachingAssignmentRequest;
use App\Models\AcademicYear;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeachingAssignmentController extends Controller
{
    /**
     * Display a listing of teaching assignments.
     */
    public function index(Request $request): Response
    {
        $assignments = TeachingAssignment::query()
            ->with([
                'teacher:id,nama',
                'subject:id,nama',
                'kelas:id,nama,tingkatan_id',
                'kelas.tingkatan:id,nama',
                'academicYear:id,nama',
                'semester:id,nama',
            ])
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(function ($builder) use ($request) {
                    $search = $request->string('search');

                    $builder->whereHas('teacher', fn ($q) => $q->where('nama', 'like', '%'.$search.'%'))
                        ->orWhereHas('subject', fn ($q) => $q->where('nama', 'like', '%'.$search.'%'))
                        ->orWhereHas('kelas', fn ($q) => $q->where('nama', 'like', '%'.$search.'%'));
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
                $request->filled('teacher_id'),
                fn ($query) => $query->where('teacher_id', $request->integer('teacher_id')),
            )
            ->when(
                $request->filled('kelas_id'),
                fn ($query) => $query->where('kelas_id', $request->integer('kelas_id')),
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/TeachingAssignments/Index', [
            'assignments' => $assignments,
            'filters' => $request->only([
                'search',
                'academic_year_id',
                'semester_id',
                'teacher_id',
                'kelas_id',
            ]),
            ...$this->getFilterOptions(),
        ]);
    }

    /**
     * Show the form for creating a new teaching assignment.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/TeachingAssignments/Create', $this->getFormOptions());
    }

    /**
     * Store a newly created teaching assignment.
     */
    public function store(StoreTeachingAssignmentRequest $request): RedirectResponse
    {
        TeachingAssignment::create($request->validated());

        return redirect()
            ->route('admin.teaching-assignments.index')
            ->with('success', 'Penugasan mengajar berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified teaching assignment.
     */
    public function edit(TeachingAssignment $teachingAssignment): Response
    {
        return Inertia::render('Admin/TeachingAssignments/Edit', [
            'assignment' => $teachingAssignment->load([
                'teacher:id,nama',
                'subject:id,nama',
                'kelas:id,nama',
                'academicYear:id,nama',
                'semester:id,nama,academic_year_id',
            ]),
            ...$this->getFormOptions(),
        ]);
    }

    /**
     * Update the specified teaching assignment.
     */
    public function update(UpdateTeachingAssignmentRequest $request, TeachingAssignment $teachingAssignment): RedirectResponse
    {
        $teachingAssignment->update($request->validated());

        return redirect()
            ->route('admin.teaching-assignments.index')
            ->with('success', 'Penugasan mengajar berhasil diperbarui.');
    }

    /**
     * Remove the specified teaching assignment.
     */
    public function destroy(TeachingAssignment $teachingAssignment): RedirectResponse
    {
        $teachingAssignment->delete();

        return redirect()
            ->route('admin.teaching-assignments.index')
            ->with('success', 'Penugasan mengajar berhasil dihapus.');
    }

    /**
     * @return array<string, mixed>
     */
    private function getFormOptions(): array
    {
        return [
            'teachers' => Teacher::query()->orderBy('nama')->get(['id', 'nama']),
            'subjects' => Subject::query()->orderBy('nama')->get(['id', 'nama']),
            'kelasList' => Kelas::query()
                ->with('tingkatan:id,nama')
                ->orderBy('nama')
                ->get(['id', 'nama', 'tingkatan_id']),
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
            'semesters' => Semester::query()
                ->orderBy('nama')
                ->get(['id', 'nama', 'academic_year_id']),
            'canCreate' => Teacher::exists()
                && Subject::exists()
                && Kelas::exists()
                && AcademicYear::exists()
                && Semester::exists(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function getFilterOptions(): array
    {
        return [
            'teachers' => Teacher::query()->orderBy('nama')->get(['id', 'nama']),
            'kelasList' => Kelas::query()
                ->with('tingkatan:id,nama')
                ->orderBy('nama')
                ->get(['id', 'nama', 'tingkatan_id']),
            'academicYears' => AcademicYear::query()
                ->orderByDesc('nama')
                ->get(['id', 'nama']),
            'semesters' => Semester::query()
                ->orderBy('nama')
                ->get(['id', 'nama', 'academic_year_id']),
        ];
    }
}
