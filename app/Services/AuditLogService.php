<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuditLogService
{
    /**
     * @var array<string, string>
     */
    private const MODULE_LABELS = [
        'tingkatans' => 'tingkatan',
        'kelas' => 'kelas',
        'subject-categories' => 'kategori mata pelajaran',
        'subjects' => 'mata pelajaran',
        'academic-years' => 'tahun akademik',
        'semesters' => 'semester',
        'teachers' => 'guru',
        'students' => 'siswa',
        'teaching-assignments' => 'penugasan mengajar',
        'questions' => 'pertanyaan evaluasi',
        'evaluation-periods' => 'periode evaluasi',
        'student-evaluations' => 'evaluasi siswa',
        'notifications' => 'notifikasi',
        'profile' => 'profil pengguna',
        'password' => 'kata sandi',
    ];

    /**
     * @var array<string, array{action: string, activity: string}>
     */
    private const ROUTE_DEFINITIONS = [
        'questions.bulk' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Memperbarui pertanyaan evaluasi secara massal',
        ],
        'questions.move' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Mengubah urutan pertanyaan evaluasi',
        ],
        'student-evaluations.select-student' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Memilih profil siswa untuk evaluasi',
        ],
        'student-evaluations.update' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Menyimpan atau mengirim evaluasi siswa',
        ],
        'notifications.read' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Menandai notifikasi sudah dibaca',
        ],
        'notifications.read-all' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Menandai semua notifikasi sudah dibaca',
        ],
        'notifications.destroy' => [
            'action' => AuditLog::ACTION_DELETE,
            'activity' => 'Menghapus notifikasi',
        ],
        'profile.update' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Memperbarui profil pengguna',
        ],
        'profile.destroy' => [
            'action' => AuditLog::ACTION_DELETE,
            'activity' => 'Menghapus akun pengguna',
        ],
        'password.update' => [
            'action' => AuditLog::ACTION_UPDATE,
            'activity' => 'Memperbarui kata sandi pengguna',
        ],
    ];

    /**
     * @return array<string, mixed>
     */
    public function getData(Request $request): array
    {
        $query = AuditLog::query()
            ->with('user:id,name,email')
            ->latest('created_at');

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($builder) use ($search) {
                $builder->where('activity', 'like', '%'.$search.'%')
                    ->orWhereHas(
                        'user',
                        fn ($userQuery) => $userQuery
                            ->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%'),
                    );
            });
        }

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->string('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->string('date_to'));
        }

        $auditLogs = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (AuditLog $auditLog) => $this->formatAuditLog($auditLog));

        return [
            'auditLogs' => $auditLogs,
            'filters' => $request->only(['search', 'action', 'user_id', 'date_from', 'date_to']),
            'summary' => [
                'total' => AuditLog::query()->count(),
                'today' => AuditLog::query()->whereDate('created_at', today())->count(),
                'login' => AuditLog::query()->where('action', AuditLog::ACTION_LOGIN)->count(),
                'create' => AuditLog::query()->where('action', AuditLog::ACTION_CREATE)->count(),
                'update' => AuditLog::query()->where('action', AuditLog::ACTION_UPDATE)->count(),
                'delete' => AuditLog::query()->where('action', AuditLog::ACTION_DELETE)->count(),
            ],
            'actionOptions' => $this->getActionOptions(),
            'users' => User::query()
                ->orderBy('name')
                ->get(['id', 'name', 'email']),
        ];
    }

    public function logLogin(User $user, Request $request): void
    {
        $this->record(
            user: $user,
            action: AuditLog::ACTION_LOGIN,
            activity: 'Pengguna masuk ke sistem',
            request: $request,
        );
    }

    public function logLogout(User $user, Request $request): void
    {
        $this->record(
            user: $user,
            action: AuditLog::ACTION_LOGOUT,
            activity: 'Pengguna keluar dari sistem',
            request: $request,
        );
    }

    public function logImport(User $user, string $module, Request $request): void
    {
        $this->record(
            user: $user,
            action: AuditLog::ACTION_IMPORT,
            activity: "Mengimpor data {$module}",
            request: $request,
        );
    }

    public function logExport(User $user, string $module, Request $request): void
    {
        $this->record(
            user: $user,
            action: AuditLog::ACTION_EXPORT,
            activity: "Mengekspor data {$module}",
            request: $request,
        );
    }

    public function logFromRequest(Request $request): void
    {
        $routeName = $request->route()?->getName();

        if (! $routeName || $this->shouldSkipRoute($routeName)) {
            return;
        }

        $definition = $this->resolveRouteDefinition($routeName, $request);

        if ($definition === null) {
            return;
        }

        [$subjectType, $subjectId] = $this->resolveSubject($request);

        $this->record(
            user: $request->user(),
            action: $definition['action'],
            activity: $definition['activity'],
            request: $request,
            subjectType: $subjectType,
            subjectId: $subjectId,
        );
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function getActionOptions(): array
    {
        return [
            ['value' => AuditLog::ACTION_LOGIN, 'label' => 'Masuk'],
            ['value' => AuditLog::ACTION_LOGOUT, 'label' => 'Keluar'],
            ['value' => AuditLog::ACTION_CREATE, 'label' => 'Tambah'],
            ['value' => AuditLog::ACTION_UPDATE, 'label' => 'Ubah'],
            ['value' => AuditLog::ACTION_DELETE, 'label' => 'Hapus'],
            ['value' => AuditLog::ACTION_IMPORT, 'label' => 'Import'],
            ['value' => AuditLog::ACTION_EXPORT, 'label' => 'Ekspor'],
        ];
    }

    private function record(
        ?User $user,
        string $action,
        string $activity,
        Request $request,
        ?string $subjectType = null,
        ?int $subjectId = null,
    ): void {
        AuditLog::query()->create([
            'user_id' => $user?->id,
            'action' => $action,
            'activity' => $activity,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 1000),
            'created_at' => now(),
        ]);
    }

    private function shouldSkipRoute(string $routeName): bool
    {
        return str_starts_with($routeName, 'audit-logs.')
            || $routeName === 'logout';
    }

    /**
     * @return array{action: string, activity: string}|null
     */
    private function resolveRouteDefinition(string $routeName, Request $request): ?array
    {
        if (isset(self::ROUTE_DEFINITIONS[$routeName])) {
            return self::ROUTE_DEFINITIONS[$routeName];
        }

        $action = match (true) {
            str_ends_with($routeName, '.store') => AuditLog::ACTION_CREATE,
            str_ends_with($routeName, '.update') => AuditLog::ACTION_UPDATE,
            str_ends_with($routeName, '.destroy') => AuditLog::ACTION_DELETE,
            default => null,
        };

        if ($action === null) {
            return null;
        }

        $module = $this->resolveModuleLabel($routeName);

        $activity = match ($action) {
            AuditLog::ACTION_CREATE => "Menambah data {$module}",
            AuditLog::ACTION_UPDATE => "Memperbarui data {$module}",
            AuditLog::ACTION_DELETE => "Menghapus data {$module}",
            default => "Aktivitas {$module}",
        };

        if (str_ends_with($routeName, '.destroy')) {
            $subjectName = $this->resolveSubjectName($request);

            if ($subjectName) {
                $activity = "Menghapus {$module}: {$subjectName}";
            }
        }

        return [
            'action' => $action,
            'activity' => $activity,
        ];
    }

    private function resolveModuleLabel(string $routeName): string
    {
        $prefix = Str::before($routeName, '.');

        return self::MODULE_LABELS[$prefix] ?? str_replace('-', ' ', $prefix);
    }

    /**
     * @return array{0: ?string, 1: ?int}
     */
    private function resolveSubject(Request $request): array
    {
        $parameters = $request->route()?->parameters() ?? [];

        foreach ($parameters as $parameter) {
            if ($parameter instanceof Model) {
                return [class_basename($parameter), $parameter->getKey()];
            }
        }

        return [null, null];
    }

    private function resolveSubjectName(Request $request): ?string
    {
        $parameters = $request->route()?->parameters() ?? [];

        foreach ($parameters as $parameter) {
            if (! $parameter instanceof Model) {
                continue;
            }

            foreach (['nama', 'name', 'title'] as $attribute) {
                $value = $parameter->getAttribute($attribute);

                if (is_string($value) && $value !== '') {
                    return $value;
                }
            }
        }

        return null;
    }

    /**
     * @return array<string, mixed>
     */
    private function formatAuditLog(AuditLog $auditLog): array
    {
        return [
            'id' => $auditLog->id,
            'action' => $auditLog->action,
            'action_label' => collect($this->getActionOptions())
                ->firstWhere('value', $auditLog->action)['label'] ?? $auditLog->action,
            'activity' => $auditLog->activity,
            'subject_type' => $auditLog->subject_type,
            'subject_id' => $auditLog->subject_id,
            'ip_address' => $auditLog->ip_address,
            'created_at' => $auditLog->created_at,
            'user' => $auditLog->user
                ? [
                    'id' => $auditLog->user->id,
                    'name' => $auditLog->user->name,
                    'email' => $auditLog->user->email,
                ]
                : null,
        ];
    }
}
