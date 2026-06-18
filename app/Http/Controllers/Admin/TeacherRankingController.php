<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Services\TeacherRankingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeacherRankingController extends Controller
{
    public function __construct(
        private readonly TeacherRankingService $teacherRankingService,
    ) {}

    /**
     * Display teacher performance rankings.
     */
    public function index(Request $request): Response
    {
        return Inertia::render(
            'Admin/TeacherRankings/Index',
            $this->teacherRankingService->getData($request),
        );
    }
}
