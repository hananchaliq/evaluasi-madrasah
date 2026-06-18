<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
   /**
    * Display a listing of teachers.
    */
   public function index(Request $request): Response
   {
      $teachers = Teacher::query()
         // 1. Eager load relasi user agar field email bisa ditarik ke React
         ->with(['user'])
         ->withCount(['teachingAssignments', 'evaluations'])
         ->when(
            $request->filled('search'),
            function ($query) use ($request) {
               $search = $request->string('search');
               $query->where(function ($builder) use ($search) {
                  $builder->where('nama', 'like', '%' . $search . '%')
                     ->orWhere('nip', 'like', '%' . $search . '%')
                     // 2. Tambah fitur pencarian berdasarkan email di tabel users
                     ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', '%' . $search . '%');
                     });
               });
            }
         )
         ->orderBy('nama')
         ->paginate(10)
         ->withQueryString();

      return Inertia::render('Admin/Teachers/Index', [
         'teachers' => $teachers,
         'filters' => $request->only(['search']),
      ]);
   }

   /**
    * Show the form for creating a new teacher.
    */
   public function create(): Response
   {
      return Inertia::render('Admin/Teachers/Create');
   }

   /**
    * Store a newly created teacher.
    */
   public function store(StoreTeacherRequest $request): RedirectResponse
   {
      // Jalankan DB Transaction biar proses insert aman sentosa
      DB::transaction(function () use ($request) {
         // 1. Buat user loginnya terlebih dahulu
         $user = User::create([
            'name' => $request->validated('nama'),
            'email' => $request->validated('email'),
            'role' => 'teacher',
            'password' => Hash::make($request->validated('nip')), // Password default menggunakan NIP
         ]);

         // 2. Buat data detail gurunya, hubungkan lewat user_id
         Teacher::create([
            'user_id' => $user->id,
            'nama' => $request->validated('nama'),
            'nip' => $request->validated('nip'),
         ]);
      });

      return redirect()
         ->route('admin.teachers.index')
         ->with('success', 'Data guru dan akun akses berhasil ditambahkan.');
   }

   /**
    * Show the form for editing the specified teacher.
    */
   public function edit(Teacher $teacher): Response
   {
      // Load data user terkait agar form edit di React langsung terisi email lamanya
      $teacher->load('user');

      return Inertia::render('Admin/Teachers/Edit', [
         'teacher' => $teacher,
      ]);
   }

   /**
    * Update the specified teacher.
    */
   public function update(UpdateTeacherRequest $request, Teacher $teacher): RedirectResponse
   {
      DB::transaction(function () use ($request, $teacher) {
         // 1. Update data guru di tabel teachers
         $teacher->update([
            'nama' => $request->validated('nama'),
            'nip' => $request->validated('nip'),
         ]);

         // 2. Update data akun di tabel users melalui relasi
         if ($teacher->user) {
            $teacher->user->update([
               'name' => $request->validated('nama'),
               'email' => $request->validated('email'),
            ]);
         }
      });

      return redirect()
         ->route('admin.teachers.index')
         ->with('success', 'Data guru berhasil diperbarui.');
   }

   /**
    * Remove the specified teacher.
    */
   public function destroy(Teacher $teacher): RedirectResponse
   {
      if ($teacher->teachingAssignments()->exists() || $teacher->evaluations()->exists()) {
         return redirect()
            ->route('admin.teachers.index')
            ->with('error', 'Data guru tidak dapat dihapus karena masih memiliki data terkait.');
      }

      DB::transaction(function () use ($teacher) {
         // Ambil instance user-nya dulu sebelum record teacher dihapus
         $user = $teacher->user;

         // 1. Hapus data di tabel teachers
         $teacher->delete();

         // 2. Hapus data di tabel users biar tidak menumpuk jadi sampah database
         if ($user) {
            $user->delete();
         }
      });

      return redirect()
         ->route('admin.teachers.index')
         ->with('success', 'Data guru beserta akun akses berhasil dihapus.');
   }
}