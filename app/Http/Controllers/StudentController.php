<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Kelas;
use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request): Response
    {
        $students = Student::query()
            ->with(['kelas:id,nama,tingkatan_id', 'kelas.tingkatan:id,nama'])
            ->withCount('evaluations')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(function ($builder) use ($request) {
                    $builder->where('nama', 'like', '%'.$request->string('search').'%')
                        ->orWhere('nis', 'like', '%'.$request->string('search').'%')
                        ->orWhereHas('kelas', fn ($kelasQuery) => $kelasQuery->where('nama', 'like', '%'.$request->string('search').'%'));
                }),
            )
            ->when(
                $request->filled('kelas_id'),
                fn ($query) => $query->where('kelas_id', $request->integer('kelas_id')),
            )
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'kelasList' => $this->getKelasOptions(),
            'filters' => $request->only(['search', 'kelas_id']),
        ]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create(): Response
    {
        return Inertia::render('Students/Create', [
            'kelasList' => $this->getKelasOptions(),
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(StoreStudentRequest $request): RedirectResponse
    {
        Student::create($request->validated());

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified student.
     */
    public function edit(Student $student): Response
    {
        return Inertia::render('Students/Edit', [
            'student' => $student->load(['kelas:id,nama,tingkatan_id', 'kelas.tingkatan:id,nama']),
            'kelasList' => $this->getKelasOptions(),
        ]);
    }

    /**
     * Update the specified student.
     */
    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        $student->update($request->validated());

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified student.
     */
    public function destroy(Student $student): RedirectResponse
    {
        if ($student->evaluations()->exists()) {
            return redirect()
                ->route('students.index')
                ->with('error', 'Data siswa tidak dapat dihapus karena masih memiliki evaluasi.');
        }

        $student->delete();

        return redirect()
            ->route('students.index')
            ->with('success', 'Data siswa berhasil dihapus.');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Kelas>
     */
    private function getKelasOptions()
    {
        return Kelas::query()
            ->with('tingkatan:id,nama')
            ->orderBy('nama')
            ->get(['id', 'nama', 'tingkatan_id']);
    }
}
