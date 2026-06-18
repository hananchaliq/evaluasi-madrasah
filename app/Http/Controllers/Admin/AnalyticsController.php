<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        private readonly AnalyticsService $analyticsService,
    ) {}

    /**
     * Display analytics statistics and rankings.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Analytics/Index', $this->analyticsService->getData($request));
    }
}
