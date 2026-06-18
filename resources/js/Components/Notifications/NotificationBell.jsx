import Dropdown from '@/Components/Dropdown';
import { Link, router, usePage } from '@inertiajs/react';
import { HiOutlineBell } from 'react-icons/hi2';

const formatRelativeTime = (value) => {
    if (!value) {
        return '';
    }

    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function NotificationBell() {
    const notificationSummary = usePage().props.notificationSummary;

    if (!notificationSummary) {
        return null;
    }

    const { unread_count: unreadCount, recent } = notificationSummary;

    const markAsRead = (notificationId) => {
        router.patch(route('admin.notifications.read', notificationId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="relative inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                    aria-label="Notifikasi"
                >
                    <HiOutlineBell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -end-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content align="right" width="80" contentClasses="py-1 bg-white">
                <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800">
                        Notifikasi
                    </p>
                    <p className="text-xs text-slate-500">
                        {unreadCount > 0
                            ? `${unreadCount} belum dibaca`
                            : 'Semua notifikasi sudah dibaca'}
                    </p>
                </div>

                {recent.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                        Tidak ada notifikasi baru.
                    </div>
                ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {recent.map((notification) => (
                            <div
                                key={notification.id}
                                className="border-b border-slate-100 px-4 py-3 last:border-b-0"
                            >
                                <p className="text-sm font-medium text-slate-800">
                                    {notification.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                                    {notification.message}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                    <span className="text-[11px] text-slate-400">
                                        {formatRelativeTime(
                                            notification.created_at,
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                        className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                                    >
                                        Tandai dibaca
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-t border-slate-100 px-4 py-2">
                    <Link
                        href={route('admin.notifications.index')}
                        className="block text-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                        Lihat Semua Notifikasi
                    </Link>
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
}
