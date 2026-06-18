<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Evaluation;
use App\Models\Semester;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class EvaluationResultController extends Controller
{
    public function index(Request $request): Response
    {
        $teacher = $request->user()->teacher;
        
        if (!$teacher) {
            abort(403);
        }

        $academicYears = AcademicYear::orderByDesc('nama')->get();
        $selectedAcademicYearId = $request->input('academic_year_id', $academicYears->firstWhere('is_active', true)?->id);
        
        $semesters = Semester::where('academic_year_id', $selectedAcademicYearId)->get();
        $selectedSemesterId = $request->input('semester_id', $semesters->firstWhere('is_active', true)?->id);

        $evaluations = Evaluation::where('teacher_id', $teacher->id)
            ->where('academic_year_id', $selectedAcademicYearId)
            ->where('semester_id', $selectedSemesterId)
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->get();

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

        return Inertia::render('Teacher/EvaluationResults/Index', [
            'filters' => [
                'academic_year_id' => (int) $selectedAcademicYearId,
                'semester_id' => (int) $selectedSemesterId,
            ],
            'academicYears' => $academicYears,
            'semesters' => $semesters,
            'stats' => [
                'average_score' => $evaluations->avg('average_score') ? round($evaluations->avg('average_score'), 2) : 0,
                'total_responses' => $evaluations->count(),
                'questions' => $questionStats,
            ]
        ]);
    }
}
