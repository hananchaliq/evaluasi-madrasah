<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Http\Requests\AuditLogFilterRequest;
use App\Services\AuditLogService;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function __construct(
        private readonly AuditLogService $auditLogService,
    ) {}

    /**
     * Display a listing of audit logs.
     */
    public function index(AuditLogFilterRequest $request): Response
    {
        return Inertia::render(
            'Admin/AuditLogs/Index',
            $this->auditLogService->getData($request),
        );
    }
}
