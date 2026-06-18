<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class EvaluationMonitoringController extends Controller
{
   public function index(Request $request): Response
   {
      $academicYears = AcademicYear::orderByDesc('nama')->get();
      $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->firstWhere('is_active', true)?->id ?? $academicYears->first()?->id);

      $semesters = Semester::where('academic_year_id', $selectedAcademicYearId)->get();
      $selectedSemesterId = $request->input('semester_id', $semesters->firstWhere('is_active', true)?->id ?? $semesters->first()?->id);

      $activePeriod = EvaluationPeriod::where('academic_year_id', $selectedAcademicYearId)
         ->where('semester_id', $selectedSemesterId)
         ->where('is_active', true)
         ->first();

      // Global Statistics
      $totalStudents = Student::count();
      $submittedEvaluations = Evaluation::where('academic_year_id', $selectedAcademicYearId)
         ->where('semester_id', $selectedSemesterId)
         ->where('status', Evaluation::STATUS_SUBMITTED)
         ->count();

      // To get "Total Expected", we need to know how many (student, teacher) pairs exist in TeachingAssignments
      $totalExpected = DB::table('teaching_assignments')
         ->join('students', 'students.kelas_id', '=', 'teaching_assignments.kelas_id')
         ->where('teaching_assignments.academic_year_id', $selectedAcademicYearId)
         ->where('teaching_assignments.semester_id', $selectedSemesterId)
         ->count();

      $completionPercentage = $totalExpected > 0 ? round(($submittedEvaluations / $totalExpected) * 100, 2) : 0;

      // Progress by Class
      $classProgress = Kelas::with(['tingkatan'])
         ->get()
         ->map(function ($kelas) use ($selectedAcademicYearId, $selectedSemesterId) {
            $studentsInClass = Student::where('kelas_id', $kelas->id)->count();

            $expectedInClass = DB::table('teaching_assignments')
               ->join('students', 'students.kelas_id', '=', 'teaching_assignments.kelas_id')
               ->where('teaching_assignments.kelas_id', $kelas->id)
               ->where('teaching_assignments.academic_year_id', $selectedAcademicYearId)
               ->where('teaching_assignments.semester_id', $selectedSemesterId)
               ->count();

            $submittedInClass = Evaluation::where('academic_year_id', $selectedAcademicYearId)
               ->where('semester_id', $selectedSemesterId)
               ->where('status', Evaluation::STATUS_SUBMITTED)
               ->whereIn('student_id', Student::where('kelas_id', $kelas->id)->pluck('id'))
               ->count();

            return [
               'id' => $kelas->id,
               'nama' => $kelas->nama,
               'tingkatan' => $kelas->tingkatan?->nama,
               'total_students' => $studentsInClass,
               'expected' => $expectedInClass,
               'submitted' => $submittedInClass,
               'percentage' => $expectedInClass > 0 ? round(($submittedInClass / $expectedInClass) * 100, 2) : 0,
            ];
         });

      // 1. Ambil data guru menggunakan Paginate (15 data per halaman)
      $paginatedTeachers = Teacher::orderBy('nama', 'asc')->paginate(15)->withQueryString();

      // 2. Manipulasi isi data di dalam objek pagination-nya menggunakan through()
      // Ini menjaga struktur pagination Laravel agar tidak rusak/hilang!
      $teacherSummaries = $paginatedTeachers->through(function ($teacher) use ($selectedAcademicYearId, $selectedSemesterId) {
         $evaluations = Evaluation::where('teacher_id', $teacher->id)
            ->where('academic_year_id', $selectedAcademicYearId)
            ->where('semester_id', $selectedSemesterId)
            ->where('status', Evaluation::STATUS_SUBMITTED);

         $avgScore = $evaluations->avg('average_score');
         $count = $evaluations->count();

         $subjects = DB::table('teaching_assignments')
            ->join('subjects', 'subjects.id', '=', 'teaching_assignments.subject_id')
            ->where('teacher_id', $teacher->id)
            ->where('academic_year_id', $selectedAcademicYearId)
            ->where('semester_id', $selectedSemesterId)
            ->pluck('subjects.nama')
            ->unique()
            ->values();

         return [
            'id' => $teacher->id,
            'nama' => $teacher->nama,
            'subjects' => $subjects,
            'total_evaluators' => $count,
            'average_score' => $avgScore ? round($avgScore, 2) : 0,
            'status' => $count > 0 ? 'active' : 'no_data',
         ];
      });

      return Inertia::render('Admin/EvaluationMonitoring/Index', [
         'filters' => [
            'academic_year_id' => (int) $selectedAcademicYearId,
            'semester_id' => (int) $selectedSemesterId,
         ],
         'academicYears' => $academicYears,
         'semesters' => $semesters,
         'activePeriod' => $activePeriod,
         'stats' => [
            'total_students' => $totalStudents,
            'submitted' => $submittedEvaluations,
            'expected' => $totalExpected,
            'percentage' => $completionPercentage,
         ],
         'classProgress' => $classProgress,
         'teacherSummaries' => $teacherSummaries, // Sekarang ini berformat JSON Pagination!
      ]);
   }

   public function show(Teacher $teacher, Request $request): Response
   {
      $selectedAcademicYearId = $request->input('academic_year_id') ?: (AcademicYear::where('is_active', true)->first()?->id ?: AcademicYear::latest()->first()?->id);
      $selectedSemesterId = $request->input('semester_id') ?: (Semester::where('academic_year_id', $selectedAcademicYearId)->where('is_active', true)->first()?->id ?: Semester::where('academic_year_id', $selectedAcademicYearId)->latest()->first()?->id);

      $evaluations = Evaluation::where('teacher_id', $teacher->id)
         ->where('academic_year_id', $selectedAcademicYearId)
         ->where('semester_id', $selectedSemesterId)
         ->where('status', Evaluation::STATUS_SUBMITTED)
         ->get();

      // Distribution (1-5)
      $distribution = [
         1 => 0,
         2 => 0,
         3 => 0,
         4 => 0,
         5 => 0
      ];

      // This is tricky because average_score is decimal. 
      // Real distribution should be based on answers and then per-evaluation average.
      // Or we just round the average_score.
      foreach ($evaluations as $eval) {
         $rounded = round($eval->average_score);
         if (isset($distribution[$rounded])) {
            $distribution[$rounded]++;
         }
      }

      // Per Question Statistics
      $questionStats = DB::table('evaluation_answers')
         ->join('evaluations', 'evaluations.id', '=', 'evaluation_answers.evaluation_id')
         ->join('questions', 'questions.id', '=', 'evaluation_answers.question_id')
         ->where('evaluations.teacher_id', $teacher->id)
         ->where('evaluations.academic_year_id', $selectedAcademicYearId)
         ->where('evaluations.semester_id', $selectedSemesterId)
         ->where('evaluations.status', Evaluation::STATUS_SUBMITTED)
         ->select('questions.id', 'questions.pertanyaan', DB::raw('AVG(evaluation_answers.score) as avg_score'), DB::raw('COUNT(*) as total'))
         ->groupBy('questions.id', 'questions.pertanyaan')
         ->get();

      return Inertia::render('Admin/EvaluationMonitoring/TeacherDetail', [
         'teacher' => $teacher,
         'stats' => [
            'average_score' => $evaluations->avg('average_score') ? round($evaluations->avg('average_score'), 2) : 0,
            'total_responses' => $evaluations->count(),
            'distribution' => $distribution,
            'questions' => $questionStats,
         ],
         'filters' => [
            'academic_year_id' => (int) $selectedAcademicYearId,
            'semester_id' => (int) $selectedSemesterId,
         ]
      ]);
   }
}
