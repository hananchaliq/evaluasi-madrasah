import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
// Import icon yang aman dan universal
import {
    HiOutlineHome,
    HiOutlineClipboardDocumentCheck,
    HiOutlineUserGroup,
    HiOutlineBookOpen,
    HiOutlineDocumentText,
    HiOutlineCalendarDays,
    HiOutlineAcademicCap,
    HiOutlineSquares2X2,
} from "react-icons/hi2";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Helper function untuk nge-render class menu biar dinamis & ga berantakan lagi
    const getMenuClass = (isActive) => {
        const baseClass =
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group w-full";
        return isActive
            ? `${baseClass} bg-emerald-950/40 text-emerald-400 border border-emerald-800/30`
            : `${baseClass} text-gray-400 hover:bg-slate-800/50 hover:text-gray-200`;
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans antialiased">
            {/* SIDEBAR UTAMA */}
            <aside className="hidden md:flex flex-col w-64 bg-[#0B132B] text-gray-300 border-r border-slate-800 shrink-0 sticky top-0 h-screen">
                {/* Header Brand */}
                <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3 shrink-0">
                    <Link href="/">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-white" />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-wide leading-none">
                            Sistem Evaluasi
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                            MAKN Ende
                        </span>
                    </div>
                </div>

                {/* AREA MENU DINAMIS (SCROLLABLE) */}
                <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* ========================================================= */}
                    {/* 1. KONDISI TAMPILAN JIKA YANG LOGIN ADALAH SISWA (STUDENT) */}
                    {/* ========================================================= */}
                    {user.role === "student" && (
                        <>
                            {/* Kategori Utama */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Utama
                                </div>
                                <Link
                                    href={route("student.dashboard")}
                                    className={getMenuClass(
                                        route().current("student.dashboard"),
                                    )}
                                >
                                    <HiOutlineHome className="h-5 w-5 shrink-0" />
                                    <span>Beranda</span>
                                </Link>
                            </div>

                            {/* Kategori Evaluasi */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Evaluasi
                                </div>
                                <Link
                                    href={route("student.dashboard")} // Arahkan sementara ke dashboard siswa
                                    className={getMenuClass(
                                        route().current(
                                            "student.evaluations.*",
                                        ),
                                    )}
                                >
                                    <HiOutlineClipboardDocumentCheck className="h-5 w-5 shrink-0" />
                                    <span>Evaluasi Guru</span>
                                </Link>
                            </div>
                        </>
                    )}

                    {/* ========================================================= */}
                    {/* 2. KONDISI TAMPILAN JIKA YANG LOGIN ADALAH GURU (TEACHER)  */}
                    {/* ========================================================= */}
                    {user.role === "teacher" && (
                        <>
                            {/* Kategori Utama */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Utama
                                </div>
                                <Link
                                    href={route("teacher.dashboard")}
                                    className={getMenuClass(
                                        route().current("teacher.dashboard"),
                                    )}
                                >
                                    <HiOutlineHome className="h-5 w-5 shrink-0" />
                                    <span>Beranda</span>
                                </Link>
                            </div>

                            {/* Kategori Evaluasi */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Evaluasi
                                </div>
                                <Link
                                    href={route("teacher.dashboard")}
                                    className={getMenuClass(
                                        route().current("teacher.results.*"),
                                    )}
                                >
                                    <HiOutlineClipboardDocumentCheck className="h-5 w-5 shrink-0" />
                                    <span>Hasil Evaluasi Saya</span>
                                </Link>
                            </div>
                        </>
                    )}

                    {/* ========================================================= */}
                    {/* 3. KONDISI TAMPILAN JIKA YANG LOGIN ADALAH ADMIN          */}
                    {/* ========================================================= */}
                    {user.role === "admin" && (
                        <>
                            {/* Kategori Utama */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Utama
                                </div>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("dashboard"),
                                    )}
                                >
                                    <HiOutlineHome className="h-5 w-5 shrink-0" />
                                    <span>Beranda</span>
                                </Link>
                            </div>

                            {/* Kategori Evaluasi */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Evaluasi
                                </div>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.monitoring.*"),
                                    )}
                                >
                                    <HiOutlineSquares2X2 className="h-5 w-5 shrink-0" />
                                    <span>Pemantauan Evaluasi</span>
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.assignments.*"),
                                    )}
                                >
                                    <HiOutlineClipboardDocumentCheck className="h-5 w-5 shrink-0" />
                                    <span>Penugasan Mengajar</span>
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.questions.*"),
                                    )}
                                >
                                    <HiOutlineDocumentText className="h-5 w-5 shrink-0" />
                                    <span>Pertanyaan Evaluasi</span>
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.periods.*"),
                                    )}
                                >
                                    <HiOutlineCalendarDays className="h-5 w-5 shrink-0" />
                                    <span>Periode Evaluasi</span>
                                </Link>
                            </div>

                            {/* Kategori Data Master */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">
                                    Data Master
                                </div>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.levels.*"),
                                    )}
                                >
                                    <HiOutlineSquares2X2 className="h-5 w-5 shrink-0" />
                                    <span>Tingkatan</span>
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.classes.*"),
                                    )}
                                >
                                    <HiOutlineAcademicCap className="h-5 w-5 shrink-0" />
                                    <span>Kelas</span>
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.subjects.*"),
                                    )}
                                >
                                    <HiOutlineBookOpen className="h-5 w-5 shrink-0" />
                                    <span>Mata Pelajaran</span>
                                </Link>
                                <Link
                                    href={route("dashboard")}
                                    className={getMenuClass(
                                        route().current("admin.teachers.*"),
                                    )}
                                >
                                    <HiOutlineUserGroup className="h-5 w-5 shrink-0" />
                                    <span>Guru</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Sidebar */}
                <div className="p-4 border-t border-slate-800 text-center text-xs text-gray-500 shrink-0">
                    Madrasah Aliyah Kejuruan Negeri Ende
                </div>
            </aside>

            {/* AREA KONTEN SEBELAH KANAN */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm/5">
                    <div>
                        {header && (
                            <div className="text-lg font-bold text-gray-800">
                                {header}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <span className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none"
                                    >
                                        {user.name}
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                                            {user.name.charAt(0)}
                                        </span>
                                    </button>
                                </span>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="p-6 md:p-8 flex-1 bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
}
