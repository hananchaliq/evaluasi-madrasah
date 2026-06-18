<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\EvaluationAnswer;
use App\Models\EvaluationPeriod;
use App\Models\Question;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class StudentEvaluationController extends Controller
{
   /**
    * Tampilkan form evaluasi.
    */
   public function show(Request $request, Teacher $teacher)
   {
      return $this->create($request, $teacher);
   }
   public function create(Request $request, Teacher $teacher)
   {
      dd(
         auth()->id(),
         $request->user(),
         $request->user()->student
      );
   }

   /**
    * Simpan evaluasi.
    */
   public function store(Request $request, Teacher $teacher)
   {
      $request->validate([
         'answers' => ['required', 'array'],
         'answers.*.question_id' => ['required', 'exists:questions,id'],
         'answers.*.score' => ['required', 'integer', 'min:1', 'max:5'],
      ]);

      $student = $request->user()->student;

      if (!$student) {
         $student = \App\Models\Student::find(
            session('selected_student_id')
         );
      }
      dd($student);

      if (!$student) {
         abort(403, 'Siswa tidak ditemukan.');
      }

      $activePeriod = EvaluationPeriod::query()
         ->where('is_active', true)
         ->first();

      if (!$activePeriod) {
         return Redirect::route('student.dashboard')
            ->with('error', 'Tidak ada periode evaluasi aktif.');
      }

      $teachingAssignment = TeachingAssignment::query()
         ->where('teacher_id', $teacher->id)
         ->where('kelas_id', $student->kelas_id)
         ->where('academic_year_id', $activePeriod->academic_year_id)
         ->where('semester_id', $activePeriod->semester_id)
         ->first();

      if (!$teachingAssignment) {
         abort(403);
      }

      $alreadyEvaluated = Evaluation::query()
         ->where('student_id', $student->id)
         ->where('teaching_assignment_id', $teachingAssignment->id)
         ->exists();

      if ($alreadyEvaluated) {
         return Redirect::route('student.dashboard')
            ->with('error', 'Anda sudah mengevaluasi guru ini.');
      }

      DB::transaction(function () use ($request, $student, $teachingAssignment) {
         $averageScore = collect($request->answers)
            ->avg('score');

         $evaluation = Evaluation::create([
            'student_id' => $student->id,
            'teaching_assignment_id' => $teachingAssignment->id,
            'average_score' => round($averageScore, 2),
            'status' => 'submitted',
            'submitted_at' => now(),
         ]);

         foreach ($request->answers as $answer) {
            EvaluationAnswer::create([
               'evaluation_id' => $evaluation->id,
               'question_id' => $answer['question_id'],
               'score' => $answer['score'],
            ]);
         }
      });

      return Redirect::route('student.dashboard')
         ->with('success', 'Evaluasi berhasil dikirim.');
   }

   public function index(Request $request)
   {

      $activePeriod = EvaluationPeriod::with([
         'academicYear',
         'semester',
      ])
         ->where('is_active', 1)
         ->first();

      $students = \App\Models\Student::with('kelas')
         ->orderBy('nama')
         ->get();

      $selectedStudentId = session('selected_student_id');

      $student = null;
      $teachers = [];
      $warnings = [];


      if ($selectedStudentId) {

         $student = \App\Models\Student::with('kelas')
            ->find($selectedStudentId);

         if ($student && $activePeriod) {

            $assignments = TeachingAssignment::with([
               'teacher',
               'subject',

            ])
               ->where('kelas_id', $student->kelas_id)
               ->where('academic_year_id', $activePeriod->academic_year_id)
               ->where('semester_id', $activePeriod->semester_id)
               ->get();

            $teachers = $assignments
               ->groupBy('teacher_id')
               ->map(function ($items) use ($student, $activePeriod) {

                  $teacher = $items->first()->teacher;

                  $evaluation = Evaluation::where(
                     'student_id',
                     $student->id
                  )
                     ->where(
                        'teacher_id',
                        $teacher->id
                     )
                     ->where(
                        'evaluation_period_id',
                        $activePeriod->id
                     )
                     ->first();

                  return [
                     'teacher' => $teacher,
                     'subjects' => $items
                        ->pluck('subject.nama')
                        ->values()
                        ->toArray(),
                     'status' => $evaluation?->status ?? 'pending',
                     'evaluation' => $evaluation,
                  ];
               })
               ->values();
         }
      }

      return Inertia::render('Student/StudentEvaluations/Index', [
         'student' => $student,
         'requiresStudentSelection' => $student === null,
         'students' => $students,
         'activePeriod' => $activePeriod,
         'teachers' => $teachers,
         'warnings' => $warnings,
      ]);
   }
   public function selectStudent(Request $request)
   {
      $request->validate([
         'student_id' => ['required', 'exists:students,id'],
      ]);

      session([
         'selected_student_id' => $request->student_id,
      ]);

      return redirect()->route('student-evaluations.index');
   }
}