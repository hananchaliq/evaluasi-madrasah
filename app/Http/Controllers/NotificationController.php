<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * Display a listing of notifications.
     */
    public function index(Request $request): Response
    {
        return Inertia::render(
            'Notifications/Index',
            $this->notificationService->getData($request),
        );
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification): RedirectResponse
    {
        $this->notificationService->markAsRead($notification);

        return back()->with('success', 'Notifikasi ditandai sudah dibaca.');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): RedirectResponse
    {
        $count = $this->notificationService->markAllAsRead();

        return back()->with(
            'success',
            $count > 0
                ? "{$count} notifikasi ditandai sudah dibaca."
                : 'Tidak ada notifikasi belum dibaca.',
        );
    }

    /**
     * Remove the specified notification.
     */
    public function destroy(Notification $notification): RedirectResponse
    {
        $this->notificationService->destroy($notification);

        return back()->with('success', 'Notifikasi berhasil dihapus.');
    }
}
