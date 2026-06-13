<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReportFilterRequest;
use App\Services\ReportService;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    ) {}

    /**
     * Display teacher evaluation report.
     */
    public function teacher(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Reports/Index',
            $this->reportService->getTeacherReport($request),
        );
    }

    /**
     * Display class evaluation report.
     */
    public function classReport(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Reports/Index',
            $this->reportService->getClassReport($request),
        );
    }

    /**
     * Display subject evaluation report.
     */
    public function subject(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Reports/Index',
            $this->reportService->getSubjectReport($request),
        );
    }

    /**
     * Display subject category evaluation report.
     */
    public function category(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Reports/Index',
            $this->reportService->getCategoryReport($request),
        );
    }

    /**
     * Display evaluation period report.
     */
    public function evaluationPeriod(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Reports/Index',
            $this->reportService->getEvaluationPeriodReport($request),
        );
    }
}
