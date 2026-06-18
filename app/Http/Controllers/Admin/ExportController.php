<?php
namespace App\Http\Controllers\Admin;

use App\Exports\ClassesExport;
use App\Exports\EvaluationResultsExport;
use App\Exports\SubjectsExport;
use App\Exports\TeachingAssignmentsExport;
use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Kelas;
use App\Models\Subject;
use App\Models\TeachingAssignment;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Teacher;
use App\Exports\TeachersExport;
use App\Models\Student;
use App\Exports\StudentsExport;  

use Inertia\Inertia;
use Inertia\Response;

class ExportController extends Controller
{
   public function index(): Response
   {
      $exports = [
         [
            'title' => 'Data Guru',
            'description' => 'Export data guru ke Excel atau PDF.',
            'module' => 'teachers',
         ],
         [
            'title' => 'Data Siswa',
            'description' => 'Export data siswa ke Excel atau PDF.',
            'module' => 'students',
         ],
         [
            'title' => 'Data Kelas',
            'description' => 'Export data kelas ke Excel atau PDF.',
            'module' => 'kelas',
         ],
         [
            'title' => 'Data Mata Pelajaran',
            'description' => 'Export data mata pelajaran ke Excel atau PDF.',
            'module' => 'subjects',
         ],
         [
            'title' => 'Penugasan Mengajar',
            'description' => 'Export data penugasan mengajar.',
            'module' => 'assignments',
         ],
         [
            'title' => 'Hasil Evaluasi',
            'description' => 'Export laporan hasil evaluasi.',
            'module' => 'evaluations',
         ],
      ];

      return Inertia::render('Admin/Exports/Index', [
         'exports' => $exports,
      ]);
   }
   // Data guru
   public function teachersExcel()
   {
      return Excel::download(
         new TeachersExport(),
         'data-guru.xlsx'
      );
   }
   public function teachersPdf()
   {
      $teachers = Teacher::query()
         ->with('user')
         ->withCount([
            'teachingAssignments',
            'evaluations',
         ])
         ->orderBy('nama')
         ->get();

      $pdf = Pdf::loadView('reports.teachers', [
         'teachers' => $teachers,
         'printedAt' => now(),
      ]);

      return $pdf->download('laporan-data-guru.pdf');
   }
   // Data siswa
   public function studentsExcel()
   {
      return Excel::download(
         new StudentsExport(),
         'data-siswa.xlsx'
      );
   }
   public function studentsPdf()
   {
      $students = Student::query()
         ->with('user')
         ->withCount([
            'evaluations',
         ])
         ->orderBy('nama')
         ->get();

      $pdf = Pdf::loadView('reports.students', [
         'students' => $students,
         'printedAt' => now(),
      ]);

      return $pdf->download('laporan-data-siswa.pdf');
   }
   // Data kelas
   public function kelasExcel()
   {
      return Excel::download(
         new ClassesExport(),
         'data-kelas.xlsx'
      );
   }
   public function kelasPdf()
   {
      $classes = Kelas::query()
         ->with('tingkatan')
         ->withCount('students')
         ->orderBy('nama')
         ->get();

      $pdf = Pdf::loadView('reports.kelas', [
         'classes' => $classes,
         'printedAt' => now(),
      ]);

      return $pdf->download('laporan-data-kelas.pdf');
   }
   // Data mata pelajaran
   public function subjectsExcel()
   {
      return Excel::download(
         new SubjectsExport(),
         'data-mata-pelajaran.xlsx'
      );
   }
   public function subjectsPdf()
   {
      $subjects = Subject::query()
         ->withCount('teachingAssignments')
         ->orderBy('nama')
         ->get();

      $pdf = Pdf::loadView('reports.subjects', [
         'subjects' => $subjects,
         'printedAt' => now(),
      ]);

      return $pdf->download('laporan-data-mata-pelajaran.pdf');
   }
   // Data penugasan mengajar
   public function assignmentsExcel()
   {
      return Excel::download(
         new TeachingAssignmentsExport(),
         'data-penugasan-mengajar.xlsx'
      );
   }
   public function assignmentsPdf()
   {
      $assignments = TeachingAssignment::query()
         ->with(['teacher', 'subject', 'kelas'])
         ->orderBy('created_at', 'desc')
         ->get();

      $pdf = Pdf::loadView('reports.teaching-assignments', [
         'assignments' => $assignments,
         'printedAt' => now(),
      ]);

      return $pdf->download('laporan-data-penugasan-mengajar.pdf');
   }
   // Data hasil evaluasi
   public function evaluationsExcel()
   {
      return Excel::download(
         new EvaluationResultsExport(),
         'data-evaluasi.xlsx'
      );
   }
   public function evaluationsPdf()
   {
      $evaluations = Evaluation::query()
         ->with(['student', 'admin.teachingAssignment.teacher', 'admin.teachingAssignment.subject'])
         ->orderBy('created_at', 'desc')
         ->get();

      $pdf = Pdf::loadView('reports.evaluations', [
         'evaluations' => $evaluations,
         'printedAt' => now(),
      ]);

      return $pdf->download('laporan-data-evaluasi.pdf');
   }
}