<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Http\Request;

class NotificationService
{
    /**
     * Sync all system notifications from current application state.
     */
    public function syncNotifications(): void
    {
        $this->syncEvaluationPeriodNotifications();
        $this->syncEvaluationDeadlineNotifications();
        $this->syncEvaluationCompletedNotifications();
    }

    /**
     * @return array<string, mixed>
     */
    public function getHeaderData(): array
    {
        $this->syncNotifications();

        $recent = Notification::query()
            ->where('is_read', false)
            ->latest()
            ->limit(5)
            ->get(['id', 'type', 'title', 'message', 'severity', 'created_at']);

        return [
            'unread_count' => Notification::query()->where('is_read', false)->count(),
            'recent' => $recent->map(fn (Notification $notification) => $this->formatNotification($notification))->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function getData(Request $request): array
    {
        $this->syncNotifications();

        $query = Notification::query()->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->filled('is_read') && $request->string('is_read') !== '') {
            $query->where('is_read', $request->string('is_read') === '1');
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', '%'.$search.'%')
                    ->orWhere('message', 'like', '%'.$search.'%');
            });
        }

        $notifications = $query
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Notification $notification) => $this->formatNotification($notification));

        return [
            'notifications' => $notifications,
            'filters' => $request->only(['search', 'type', 'is_read']),
            'summary' => [
                'total' => Notification::query()->count(),
                'unread' => Notification::query()->where('is_read', false)->count(),
                'read' => Notification::query()->where('is_read', true)->count(),
            ],
            'typeOptions' => $this->getTypeOptions(),
        ];
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function getDashboardNotifications(int $limit = 5): array
    {
        $this->syncNotifications();

        return Notification::query()
            ->where('is_read', false)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn (Notification $notification) => [
                'type' => $notification->severity,
                'title' => $notification->title,
                'message' => $notification->message,
                'notification_id' => $notification->id,
            ])
            ->all();
    }

    public function markAsRead(Notification $notification): void
    {
        if ($notification->is_read) {
            return;
        }

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    public function markAllAsRead(): int
    {
        return Notification::query()
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function destroy(Notification $notification): void
    {
        $notification->delete();
    }

    /**
     * @return array<int, array<string, string>>
     */
    public function getTypeOptions(): array
    {
        return [
            ['value' => Notification::TYPE_EVALUATION_PERIOD_NEW, 'label' => 'Periode Evaluasi Baru'],
            ['value' => Notification::TYPE_EVALUATION_DEADLINE, 'label' => 'Batas Waktu Evaluasi'],
            ['value' => Notification::TYPE_EVALUATION_COMPLETED, 'label' => 'Evaluasi Selesai'],
        ];
    }

    private function syncEvaluationPeriodNotifications(): void
    {
        $validReferenceIds = [];

        EvaluationPeriod::query()
            ->with(['academicYear:id,nama', 'semester:id,nama'])
            ->where('created_at', '>=', now()->subDays(14))
            ->get()
            ->each(function (EvaluationPeriod $period) use (&$validReferenceIds) {
                $validReferenceIds[] = $period->id;

                Notification::query()->updateOrCreate(
                    [
                        'type' => Notification::TYPE_EVALUATION_PERIOD_NEW,
                        'reference_type' => 'evaluation_period',
                        'reference_id' => $period->id,
                    ],
                    [
                        'title' => 'Periode Evaluasi Baru',
                        'message' => "Periode \"{$period->nama}\" telah dibuat untuk {$period->academicYear?->nama} · {$period->semester?->nama}.",
                        'severity' => Notification::SEVERITY_INFO,
                    ],
                );
            });

        $this->pruneStaleNotifications(
            Notification::TYPE_EVALUATION_PERIOD_NEW,
            'evaluation_period',
            $validReferenceIds,
        );
    }

    private function syncEvaluationDeadlineNotifications(): void
    {
        $today = now()->startOfDay();
        $validReferenceIds = [];

        EvaluationPeriod::query()
            ->where('is_active', true)
            ->whereDate('end_date', '>=', $today)
            ->whereDate('end_date', '<=', $today->copy()->addDays(7))
            ->get()
            ->each(function (EvaluationPeriod $period) use ($today, &$validReferenceIds) {
                $validReferenceIds[] = $period->id;

                $endDate = Carbon::parse($period->end_date)->startOfDay();
                $daysRemaining = $today->diffInDays($endDate, false);

                $message = $daysRemaining === 0
                    ? "Periode \"{$period->nama}\" berakhir hari ini."
                    : "Periode \"{$period->nama}\" akan berakhir dalam {$daysRemaining} hari.";

                Notification::query()->updateOrCreate(
                    [
                        'type' => Notification::TYPE_EVALUATION_DEADLINE,
                        'reference_type' => 'evaluation_period',
                        'reference_id' => $period->id,
                    ],
                    [
                        'title' => 'Batas Waktu Evaluasi',
                        'message' => $message,
                        'severity' => Notification::SEVERITY_WARNING,
                    ],
                );
            });

        $this->pruneStaleNotifications(
            Notification::TYPE_EVALUATION_DEADLINE,
            'evaluation_period',
            $validReferenceIds,
        );
    }

    private function syncEvaluationCompletedNotifications(): void
    {
        $validReferenceIds = [];

        Evaluation::query()
            ->with([
                'student:id,nama',
                'teacher:id,nama',
            ])
            ->where('status', Evaluation::STATUS_SUBMITTED)
            ->where('submitted_at', '>=', now()->subDays(14))
            ->latest('submitted_at')
            ->get()
            ->each(function (Evaluation $evaluation) use (&$validReferenceIds) {
                $validReferenceIds[] = $evaluation->id;

                Notification::query()->updateOrCreate(
                    [
                        'type' => Notification::TYPE_EVALUATION_COMPLETED,
                        'reference_type' => 'evaluation',
                        'reference_id' => $evaluation->id,
                    ],
                    [
                        'title' => 'Evaluasi Selesai',
                        'message' => "Siswa {$evaluation->student?->nama} menyelesaikan evaluasi untuk guru {$evaluation->teacher?->nama}.",
                        'severity' => Notification::SEVERITY_SUCCESS,
                    ],
                );
            });

        $this->pruneStaleNotifications(
            Notification::TYPE_EVALUATION_COMPLETED,
            'evaluation',
            $validReferenceIds,
        );
    }

    /**
     * @param  array<int, int>  $validReferenceIds
     */
    private function pruneStaleNotifications(
        string $type,
        string $referenceType,
        array $validReferenceIds,
    ): void {
        $query = Notification::query()
            ->where('type', $type)
            ->where('reference_type', $referenceType);

        if ($validReferenceIds === []) {
            $query->delete();

            return;
        }

        $query->whereNotIn('reference_id', $validReferenceIds)->delete();
    }

    /**
     * @return array<string, mixed>
     */
    private function formatNotification(Notification $notification): array
    {
        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'type_label' => collect($this->getTypeOptions())
                ->firstWhere('value', $notification->type)['label'] ?? $notification->type,
            'title' => $notification->title,
            'message' => $notification->message,
            'severity' => $notification->severity,
            'is_read' => $notification->is_read,
            'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
        ];
    }
}
