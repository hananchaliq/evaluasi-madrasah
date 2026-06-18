<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\SystemSetting;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;

class SystemSettingController extends Controller
{
    public function __construct(
        private readonly AuditLogService $auditLogService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => SystemSetting::all(),
            'groups' => [
                'general' => 'Umum',
                'evaluation' => 'Evaluasi',
            ]
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:system_settings,key',
            'settings.*.value' => 'nullable|string',
        ]);

        foreach ($request->settings as $setting) {
            SystemSetting::setValue($setting['key'], $setting['value']);
        }

        $this->auditLogService->log(
            $request->user(),
            'update_settings',
            'Memperbarui pengaturan sistem'
        );

        return Redirect::back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
