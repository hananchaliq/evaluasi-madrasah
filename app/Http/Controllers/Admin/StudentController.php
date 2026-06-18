<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\Kelas;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
         ->with([
            'kelas:id,nama,tingkatan_id',
            'kelas.tingkatan:id,nama',
            'user:id,email'
         ])
         ->withCount('evaluations')
         ->when(
            $request->filled('search'),
            fn($query) => $query->where(function ($builder) use ($request) {
               $search = $request->string('search');
               $builder->where('nama', 'like', '%' . $search . '%')
                  ->orWhere('nis', 'like', '%' . $search . '%')
                  ->orWhereHas('kelas', fn($kelasQuery) => $kelasQuery->where('nama', 'like', '%' . $search . '%'))
                  ->orWhereHas('user', fn($userQuery) => $userQuery->where('email', 'like', '%' . $search . '%'));
            }),
         )
         ->when(
            $request->filled('kelas_id'),
            fn($query) => $query->where('kelas_id', $request->integer('kelas_id')),
         )
         ->orderBy('nama')
         ->paginate(10)
         ->withQueryString();

      return Inertia::render('Admin/Students/Index', [
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
      return Inertia::render('Admin/Students/Create', [
         'kelasList' => $this->getKelasOptions(),
      ]);
   }

   /**
    * Store a newly created student.
    */
   public function store(StoreStudentRequest $request): RedirectResponse
   {
      DB::transaction(function () use ($request) {
         $validated = $request->validated();

         // Sanitasi NIS: Hilangkan spasi ujung & paksa jadi huruf kecil biar seragam
         $cleanNis = strtolower(trim($validated['nis']));

         // 1. Buat User baru dengan role 'student'
         $user = User::create([
            'name' => $validated['nama'],
            'email' => trim($validated['email']),
            'password' => Hash::make($cleanNis), // Password terenkripsi dengan NIS yang bersih
            'role' => 'student',
         ]);

         // 2. Buat data Student (NIS asli tetap disimpan sesuai input untuk display)
         Student::create([
            'user_id' => $user->id,
            'nis' => trim($validated['nis']),
            'nama' => $validated['nama'],
            'kelas_id' => $validated['kelas_id'],
         ]);
      });

      return redirect()
         ->route('admin.students.index')
         ->with('success', 'Data siswa dan akun login berhasil ditambahkan.');
   }

   /**
    * Show the form for editing the specified student.
    */
   public function edit(Student $student): Response
   {
      return Inertia::render('Admin/Students/Edit', [
         'student' => $student->load(['kelas:id,nama,tingkatan_id', 'kelas.tingkatan:id,nama', 'user:id,email']),
         'kelasList' => $this->getKelasOptions(),
      ]);
   }

   /**
    * Update the specified student.
    */
   public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
   {
      DB::transaction(function () use ($request, $student) {
         $validated = $request->validated();

         // Sanitasi NIS untuk jaga-jaga update password
         $cleanNis = strtolower(trim($validated['nis']));

         if ($student->user) {
            $student->user->update([
               'name' => $validated['nama'],
               'email' => trim($validated['email']),
               'role' => 'student',
            ]);
         } else {
            $user = User::create([
               'name' => $validated['nama'],
               'email' => trim($validated['email']),
               'password' => Hash::make($cleanNis),
               'role' => 'student',
            ]);
            $student->user_id = $user->id;
         }

         $student->update([
            'nis' => trim($validated['nis']),
            'nama' => $validated['nama'],
            'kelas_id' => $validated['kelas_id'],
            'user_id' => $student->user_id,
         ]);
      });

      return redirect()
         ->route('admin.students.index')
         ->with('success', 'Data siswa berhasil diperbarui.');
   }

   /**
    * Remove the specified student.
    */
   public function destroy(Student $student): RedirectResponse
   {
      if ($student->evaluations()->exists()) {
         return redirect()
            ->route('admin.students.index')
            ->with('error', 'Data siswa tidak dapat dihapus karena masih memiliki evaluasi.');
      }

      DB::transaction(function () use ($student) {
         $user = $student->user;

         $student->delete();

         if ($user) {
            $user->delete();
         }
      });

      return redirect()
         ->route('admin.students.index')
         ->with('success', 'Data siswa dan akun login berhasil dihapus.');
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