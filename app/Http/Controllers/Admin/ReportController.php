<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Exports\ReportExport;
use App\Http\Requests\ReportFilterRequest;
use App\Services\AuditLogService;
use App\Services\PdfService;
use App\Services\ExcelService;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService  $reportService,
        private readonly PdfService     $pdfService,
        private readonly ExcelService   $excelService,
        private readonly AuditLogService $auditLogService,
    ) {}

    // ─────────────────────────── Inertia pages ────────────────────────────

    /**
     * Display teacher evaluation report.
     */
    public function teacher(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Admin/Reports/Index',
            $this->reportService->getTeacherReport($request),
        );
    }

    /**
     * Display class evaluation report.
     */
    public function classReport(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Admin/Reports/Index',
            $this->reportService->getClassReport($request),
        );
    }

    /**
     * Display subject evaluation report.
     */
    public function subject(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Admin/Reports/Index',
            $this->reportService->getSubjectReport($request),
        );
    }

    /**
     * Display subject category evaluation report.
     */
    public function category(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Admin/Reports/Index',
            $this->reportService->getCategoryReport($request),
        );
    }

    /**
     * Display evaluation period report.
     */
    public function evaluationPeriod(ReportFilterRequest $request): Response
    {
        return Inertia::render(
            'Admin/Reports/Index',
            $this->reportService->getEvaluationPeriodReport($request),
        );
    }

    // ──────────────────────────── PDF exports ─────────────────────────────

    /**
     * Download teacher report as PDF.
     */
    public function downloadTeacherPdf(ReportFilterRequest $request): SymfonyResponse
    {
        return $this->downloadPdf($request, ReportService::TYPE_TEACHER, 'laporan-guru');
    }

    /**
     * Download class report as PDF.
     */
    public function downloadClassPdf(ReportFilterRequest $request): SymfonyResponse
    {
        return $this->downloadPdf($request, ReportService::TYPE_CLASS, 'laporan-kelas');
    }

    /**
     * Download subject report as PDF.
     */
    public function downloadSubjectPdf(ReportFilterRequest $request): SymfonyResponse
    {
        return $this->downloadPdf($request, ReportService::TYPE_SUBJECT, 'laporan-mata-pelajaran');
    }

    /**
     * Download category report as PDF.
     */
    public function downloadCategoryPdf(ReportFilterRequest $request): SymfonyResponse
    {
        return $this->downloadPdf($request, ReportService::TYPE_CATEGORY, 'laporan-kategori-mapel');
    }

    /**
     * Download evaluation period report as PDF.
     */
    public function downloadEvaluationPeriodPdf(ReportFilterRequest $request): SymfonyResponse
    {
        return $this->downloadPdf($request, ReportService::TYPE_EVALUATION_PERIOD, 'laporan-periode-evaluasi');
    }

    // ──────────────────────────── Internals ───────────────────────────────

    /**
     * Build PDF data and return a download response.
     */
    private function downloadPdf(
        ReportFilterRequest $request,
        string $reportType,
        string $baseFilename,
    ): SymfonyResponse {
        $data = $this->reportService->getPdfData($request, $reportType);

        $filename = $baseFilename . '_' . now()->format('Ymd_His') . '.pdf';

        $this->auditLogService->logExport(
            $request->user(),
            $data['report']['title'],
            $request,
        );

        return $this->pdfService->download('reports.pdf', $data, $filename);
    }

    // ──────────────────────────── Excel exports ─────────────────────────────

    public function downloadTeacherExcel(ReportFilterRequest $request): BinaryFileResponse
    {
        return $this->downloadExcel($request, ReportService::TYPE_TEACHER, 'laporan-guru');
    }

    public function downloadClassExcel(ReportFilterRequest $request): BinaryFileResponse
    {
        return $this->downloadExcel($request, ReportService::TYPE_CLASS, 'laporan-kelas');
    }

    public function downloadSubjectExcel(ReportFilterRequest $request): BinaryFileResponse
    {
        return $this->downloadExcel($request, ReportService::TYPE_SUBJECT, 'laporan-mata-pelajaran');
    }

    public function downloadCategoryExcel(ReportFilterRequest $request): BinaryFileResponse
    {
        return $this->downloadExcel($request, ReportService::TYPE_CATEGORY, 'laporan-kategori-mapel');
    }

    public function downloadEvaluationPeriodExcel(ReportFilterRequest $request): BinaryFileResponse
    {
        return $this->downloadExcel($request, ReportService::TYPE_EVALUATION_PERIOD, 'laporan-periode-evaluasi');
    }

    /**
     * Build report data and return an Excel download response.
     */
    private function downloadExcel(
        ReportFilterRequest $request,
        string $reportType,
        string $baseFilename,
    ): BinaryFileResponse {
        $data = $this->reportService->getPdfData($request, $reportType);

        $filename = $baseFilename . '_' . now()->format('Ymd_His') . '.xlsx';

        $this->auditLogService->logExport(
            $request->user(),
            $data['report']['title'],
            $request,
        );

        return $this->excelService->download(new ReportExport($data), $filename);
    }
}
