<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use App\Models\Kelas;
use App\Models\Semester;
use App\Models\Teacher;
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

      $selectedStatus = $request->input('status', Evaluation::STATUS_SUBMITTED);

      // Ambil List Semua Kelas untuk Dropdown Filter Baru
      $allClasses = Kelas::with(['tingkatan'])->get()->map(function ($k) {
         return [
            'id' => $k->id,
            'nama' => $k->nama . ' (' . ($k->tingkatan?->nama ?? '-') . ')'
         ];
      });
      $selectedKelasId = $request->input('kelas_id'); // Filter kelas opsional

      $activePeriod = EvaluationPeriod::where('academic_year_id', $selectedAcademicYearId)
         ->where('semester_id', $selectedSemesterId)
         ->where('is_active', true)
         ->first();

      // Global Statistics
      $totalStudents = Student::count();

      $filteredEvaluationsCount = Evaluation::where('academic_year_id', $selectedAcademicYearId)
         ->where('semester_id', $selectedSemesterId)
         ->when($selectedStatus, function ($query) use ($selectedStatus) {
            return $query->where('status', $selectedStatus);
         })
         ->when($selectedKelasId, function ($query) use ($selectedKelasId) {
            return $query->whereIn('student_id', Student::where('kelas_id', $selectedKelasId)->pluck('id'));
         })
         ->count();

      $totalExpected = DB::table('teaching_assignments')
         ->join('students', 'students.kelas_id', '=', 'teaching_assignments.kelas_id')
         ->where('teaching_assignments.academic_year_id', $selectedAcademicYearId)
         ->where('teaching_assignments.semester_id', $selectedSemesterId)
         ->when($selectedKelasId, function ($query) use ($selectedKelasId) {
            return $query->where('teaching_assignments.kelas_id', $selectedKelasId);
         })
         ->count();

      $completionPercentage = $totalExpected > 0 ? round(($filteredEvaluationsCount / $totalExpected) * 100, 2) : 0;

      // Progress by Class (Kiri)
      $classProgress = Kelas::with(['tingkatan'])
         ->get()
         ->map(function ($kelas) use ($selectedAcademicYearId, $selectedSemesterId, $selectedStatus) {
            $studentsInClass = Student::where('kelas_id', $kelas->id)->count();

            $expectedInClass = DB::table('teaching_assignments')
               ->join('students', 'students.kelas_id', '=', 'teaching_assignments.kelas_id')
               ->where('teaching_assignments.kelas_id', $kelas->id)
               ->where('teaching_assignments.academic_year_id', $selectedAcademicYearId)
               ->where('teaching_assignments.semester_id', $selectedSemesterId)
               ->count();

            $submittedInClass = Evaluation::where('academic_year_id', $selectedAcademicYearId)
               ->where('semester_id', $selectedSemesterId)
               ->when($selectedStatus, function ($query) use ($selectedStatus) {
                  return $query->where('status', $selectedStatus);
               })
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

      // LOGIKA DINAMIS UNTUK BAGIAN KANAN
      $tableData = null;

      if ($selectedStatus === Evaluation::STATUS_DRAFT) {
         // JIKA DRAFT: Tampilkan data individu siswa + kolom kelas + filter kelas jika aktif
         $paginatedDrafts = Evaluation::where('academic_year_id', $selectedAcademicYearId)
            ->where('semester_id', $selectedSemesterId)
            ->where('status', Evaluation::STATUS_DRAFT)
            ->when($selectedKelasId, function ($query) use ($selectedKelasId) {
               return $query->whereIn('student_id', Student::where('kelas_id', $selectedKelasId)->pluck('id'));
            })
            ->with(['student.kelas', 'teacher'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

         $totalQuestions = DB::table('questions')->count();

         $tableData = $paginatedDrafts->through(function ($evaluation) use ($totalQuestions, $selectedAcademicYearId, $selectedSemesterId) {
            $answeredCount = DB::table('evaluation_answers')
               ->where('evaluation_id', $evaluation->id)
               ->whereNotNull('score')
               ->count();

            $subjectNama = DB::table('teaching_assignments')
               ->join('subjects', 'subjects.id', '=', 'teaching_assignments.subject_id')
               ->where('teaching_assignments.academic_year_id', $selectedAcademicYearId)
               ->where('teaching_assignments.semester_id', $selectedSemesterId)
               ->where('teaching_assignments.teacher_id', $evaluation->teacher_id)
               ->where('teaching_assignments.kelas_id', $evaluation->student?->kelas_id)
               ->value('subjects.nama') ?? 'Mata Pelajaran';

            return [
               'id' => $evaluation->id,
               'student_nama' => $evaluation->student?->nama ?? 'Siswa Tidak Diketahui',
               'kelas_nama' => $evaluation->student?->kelas?->nama ?? '-', // Data kolom kelas eksplisit
               'teacher_nama' => $evaluation->teacher?->nama ?? 'Guru Tidak Diketahui',
               'subject_nama' => $subjectNama,
               'unanswered_questions' => max(0, $totalQuestions - $answeredCount),
            ];
         });
      } else {
         // JIKA SUBMITTED: Kembali ke format guru semula
         $paginatedTeachers = Teacher::orderBy('nama', 'asc')->paginate(15)->withQueryString();

         $tableData = $paginatedTeachers->through(function ($teacher) use ($selectedAcademicYearId, $selectedSemesterId) {
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
      }

      return Inertia::render('Admin/EvaluationMonitoring/Index', [
         'filters' => [
            'academic_year_id' => (int) $selectedAcademicYearId,
            'semester_id' => (int) $selectedSemesterId,
            'status' => $selectedStatus,
            'kelas_id' => $selectedKelasId ? (int) $selectedKelasId : '',
         ],
         'academicYears' => $academicYears,
         'semesters' => $semesters,
         'classes' => $allClasses, // Dikirim ke view
         'activePeriod' => $activePeriod,
         'stats' => [
            'total_students' => $totalStudents,
            'submitted' => $filteredEvaluationsCount,
            'expected' => $totalExpected,
            'percentage' => $completionPercentage,
         ],
         'classProgress' => $classProgress,
         'tableData' => $tableData,
      ]);
   }
   public function show(Teacher $teacher, Request $request): Response
   {
      $selectedAcademicYearId = $request->input('academic_year_id') ?: (AcademicYear::where('is_active', true)->first()?->id ?: AcademicYear::latest()->first()?->id);
      $selectedSemesterId = $request->input('semester_id') ?: (Semester::where('academic_year_id', $selectedAcademicYearId)->where('is_active', true)->first()?->id ?: Semester::where('academic_year_id', $selectedAcademicYearId)->latest()->first()?->id);

      $selectedStatus = $request->input('status', Evaluation::STATUS_SUBMITTED);

      $evaluations = Evaluation::where('teacher_id', $teacher->id)
         ->where('academic_year_id', $selectedAcademicYearId)
         ->where('semester_id', $selectedSemesterId)
         ->when($selectedStatus, function ($query) use ($selectedStatus) {
            return $query->where('status', $selectedStatus);
         })
         ->get();

      $distribution = [
         1 => 0,
         2 => 0,
         3 => 0,
         4 => 0,
         5 => 0
      ];

      foreach ($evaluations as $eval) {
         $rounded = round($eval->average_score);
         if (isset($distribution[$rounded])) {
            $distribution[$rounded]++;
         }
      }

      // --- HITUNG TINGKAT RESPONS DINAMIS UNTUK DETAIL GURU ---
      // Ambil total siswa yang seharusnya mengisi kuesioner guru ini berdasarkan plotting mengajar
      $totalExpectedStudents = DB::table('teaching_assignments')
         ->join('students', 'students.kelas_id', '=', 'teaching_assignments.kelas_id')
         ->where('teaching_assignments.teacher_id', $teacher->id)
         ->where('teaching_assignments.academic_year_id', $selectedAcademicYearId)
         ->where('teaching_assignments.semester_id', $selectedSemesterId)
         ->count();

      $totalResponses = $evaluations->count();

      // Rumus Persentase Tingkat Respons
      $responseRate = $totalExpectedStudents > 0
         ? round(($totalResponses / $totalExpectedStudents) * 100, 2)
         : 0;

      if ($responseRate > 100) {
         $responseRate = 100; // Amankan batas max jika ada redundansi data siswa
      }
      // -------------------------------------------------------

      $questionStats = DB::table('evaluation_answers')
         ->join('evaluations', 'evaluations.id', '=', 'evaluation_answers.evaluation_id')
         ->join('questions', 'questions.id', '=', 'evaluation_answers.question_id')
         ->where('evaluations.teacher_id', $teacher->id)
         ->where('evaluations.academic_year_id', $selectedAcademicYearId)
         ->where('evaluations.semester_id', $selectedSemesterId)
         ->when($selectedStatus, function ($query) use ($selectedStatus) {
            return $query->where('evaluations.status', $selectedStatus);
         })
         ->select('questions.id', 'questions.pertanyaan', DB::raw('AVG(evaluation_answers.score) as avg_score'), DB::raw('COUNT(*) as total'))
         ->groupBy('questions.id', 'questions.pertanyaan')
         ->get();

      return Inertia::render('Admin/EvaluationMonitoring/TeacherDetail', [
         'teacher' => $teacher,
         'stats' => [
            'average_score' => $evaluations->avg('average_score') ? round($evaluations->avg('average_score'), 2) : 0,
            'total_responses' => $totalResponses,
            'response_rate' => $responseRate, // <-- SEKARANG DIKIRIM KE FRONTEND!
            'distribution' => $distribution,
            'questions' => $questionStats,
         ],
         'filters' => [
            'academic_year_id' => (int) $selectedAcademicYearId,
            'semester_id' => (int) $selectedSemesterId,
            'status' => $selectedStatus,
         ]
      ]);
   }
}