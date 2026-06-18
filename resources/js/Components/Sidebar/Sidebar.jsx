import ApplicationLogo from "@/Components/ApplicationLogo";
import { adminNavigation, studentNavigation, teacherNavigation } from "@/config/navigation";
import { Link, usePage } from "@inertiajs/react";
import { HiOutlineXMark } from "react-icons/hi2";
import SidebarNavGroup from "./SidebarNavGroup";

export default function Sidebar({ isOpen, onClose }) {
    const { auth } = usePage().props;
    const userRole = auth.user.role;

    const navigation = userRole === 'admin' 
        ? adminNavigation 
        : (userRole === 'teacher' ? teacherNavigation : studentNavigation);

    const sidebarContent = (
        <div className="flex h-full flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
                <Link
                    href={route("dashboard")}
                    className="flex items-center gap-3"
                    onClick={onClose}
                >
                    <ApplicationLogo className="h-8 w-auto fill-current text-emerald-400" />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                            Sistem Evaluasi
                        </p>
                        <p className="truncate text-xs text-slate-400">
                            MAKN Ende
                        </p>
                    </div>
                </Link>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                    aria-label="Tutup menu"
                >
                    <HiOutlineXMark className="h-5 w-5" />
                </button>
            </div>

            <nav
                className="sidebar-scroll flex-1 space-y-6 overflow-y-auto px-3 py-4"
                aria-label="Navigasi utama"
            >
                {navigation.map((group) => (
                    <SidebarNavGroup
                        key={group.key}
                        group={group}
                        onNavigate={onClose}
                    />
                ))}
            </nav>

            <div className="shrink-0 border-t border-slate-800 px-4 py-4">
                <p className="text-center text-xs text-slate-500">
                    Madrasah Aliyah Kejuruan Negeri Ende
                </p>
            </div>
        </div>
    );

    return (
        <>
            <div
                className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            <aside
                className={`fixed inset-y-0 inset-s-0 z-50 w-72 transform bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                aria-label="Sidebar"
            >
                {sidebarContent}
            </aside>
        </>
    );
}
