<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $teacher = $request->user()->teacher;
        
        if (!$teacher) {
            abort(403, 'Profil guru tidak ditemukan.');
        }

        $activePeriod = EvaluationPeriod::where('is_active', true)->first();
        
        $stats = [
            'total_evaluations' => 0,
            'average_score' => 0,
        ];

        if ($activePeriod) {
            $evaluations = Evaluation::where('teacher_id', $teacher->id)
                ->where('evaluation_period_id', $activePeriod->id)
                ->where('status', Evaluation::STATUS_SUBMITTED);
                
            $stats['total_evaluations'] = $evaluations->count();
            $stats['average_score'] = $evaluations->avg('average_score') ? round($evaluations->avg('average_score'), 2) : 0;
        }

        return Inertia::render('Teacher/Dashboard', [
            'teacher' => $teacher,
            'activePeriod' => $activePeriod,
            'stats' => $stats,
        ]);
    }
}
