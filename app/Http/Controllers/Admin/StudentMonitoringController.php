<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Services\StudentMonitoringService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentMonitoringController extends Controller
{
    public function __construct(
        private readonly StudentMonitoringService $studentMonitoringService,
    ) {}

    /**
     * Display student evaluation monitoring data.
     */
    public function index(Request $request): Response
    {
        return Inertia::render(
            'Admin/StudentMonitoring/Index',
            $this->studentMonitoringService->getData($request),
        );
    }
}
