import Dropdown from '@/Components/Dropdown';
import FlashMessage from '@/Components/FlashMessage';
import NotificationBell from '@/Components/Notifications/NotificationBell';
import Sidebar from '@/Components/Sidebar/Sidebar';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    HiOutlineBars3,
    HiOutlineChevronDown,
} from 'react-icons/hi2';

export default function AdminLayout({ title, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:ps-72">
                <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
                    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex min-w-0 items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
                                aria-label="Buka menu"
                            >
                                <HiOutlineBars3 className="h-6 w-6" />
                            </button>

                            {title && (
                                <h1 className="truncate text-lg font-semibold text-slate-800 sm:text-xl">
                                    {title}
                                </h1>
                            )}
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                            <NotificationBell />
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <span className="hidden max-w-40 truncate sm:inline">
                                            {user.name}
                                        </span>
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                        <HiOutlineChevronDown className="h-4 w-4 text-slate-400" />
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    <div className="border-b border-slate-100 px-4 py-3">
                                        <p className="truncate text-sm font-medium text-slate-800">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Profil
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                    >
                                        Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <FlashMessage />
                    {children}
                </main>
            </div>
        </div>
    );
}
