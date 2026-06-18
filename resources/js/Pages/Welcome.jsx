import { Head, Link } from "@inertiajs/react";
import {
    HiOutlineAcademicCap,
    HiOutlineClipboardDocumentCheck,
    HiOutlineChartBar,
    HiOutlineShieldCheck,
    HiOutlineUserGroup,
    HiOutlineDocumentArrowDown,
} from "react-icons/hi2";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Evaluasi Pembelajaran Madrasah" />
            <div className="bg-gray-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-200 min-h-screen">
                {/* Background Efek Estetik */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none dark:from-emerald-500/5" />

                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-emerald-600 selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        {/* HEADER & NAVIGASI */}
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3 lg:col-start-1">
                                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                                    <HiOutlineAcademicCap className="size-6" />
                                </div>
                                <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                                    E-Evaluasi{" "}
                                    <span className="text-emerald-600">
                                        Madrasah
                                    </span>
                                </span>
                            </div>

                            <nav className="-mx-3 flex flex-1 justify-end lg:col-start-3">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                                    >
                                        Masuk Dashboard
                                    </Link>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            href={route("login")}
                                            className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="rounded-xl bg-emerald-600/10 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </nav>
                        </header>

                        {/* HERO SECTION */}
                        <div className="text-center mt-16 max-w-3xl mx-auto space-y-4">
                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                                Mewujudkan Evaluasi Madrasah yang{" "}
                                <span className="text-emerald-600">
                                    Akuntabel & Modern
                                </span>
                            </h1>
                            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Selamat datang di Platform Evaluasi Pembelajaran
                                Madrasah. Solusi digital terintegrasi untuk
                                mempermudah Guru dalam mengelola asesmen dan
                                membantu Siswa mencapai potensi akademik
                                terbaiknya.
                            </p>
                        </div>

                        {/* MAIN CONTENT / KELEBIHAN */}
                        <main className="mt-16 mb-20">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                {/* KARTU UTAMA: UNTUK GURU */}
                                <div className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition duration-300 hover:shadow-md lg:p-10 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 sm:size-14 dark:bg-emerald-500/20 dark:text-emerald-400">
                                        <HiOutlineUserGroup className="size-6 sm:size-7" />
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                            Ruang Kerja Guru (Asatidz)
                                        </h2>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            Dirancang khusus untuk mempermudah
                                            manajemen evaluasi pembelajaran,
                                            pembuatan soal, hingga analisis
                                            nilai secara otomatis tanpa repot.
                                        </p>

                                        {/* Sub-Kelebihan Guru */}
                                        <ul className="mt-6 space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <li className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <HiOutlineClipboardDocumentCheck className="size-5 shrink-0 text-emerald-500" />
                                                <span>
                                                    <strong>
                                                        Bank Soal Fleksibel:
                                                    </strong>{" "}
                                                    Buat pilihan ganda atau esai
                                                    yang mendukung integrasi
                                                    materi keagamaan
                                                    (Arab/Pegon).
                                                </span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <HiOutlineChartBar className="size-5 shrink-0 text-emerald-500" />
                                                <span>
                                                    <strong>
                                                        Analisis Otomatis:
                                                    </strong>{" "}
                                                    Nilai ujian langsung
                                                    terkapasitas otomatis
                                                    lengkap dengan analisis daya
                                                    pembeda soal.
                                                </span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <HiOutlineDocumentArrowDown className="size-5 shrink-0 text-emerald-500" />
                                                <span>
                                                    <strong>
                                                        Ekspor Raport & Rekap:
                                                    </strong>{" "}
                                                    Unduh hasil evaluasi dalam
                                                    format Excel atau PDF siap
                                                    cetak kapan saja.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* KARTU KEDUA: UNTUK SISWA */}
                                <div className="flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 transition duration-300 hover:shadow-md lg:p-10 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 sm:size-14 dark:bg-blue-500/20 dark:text-blue-400">
                                        <HiOutlineAcademicCap className="size-6 sm:size-7" />
                                    </div>

                                    <div className="space-y-3">
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                                            Ruang Belajar Siswa (Santri)
                                        </h2>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                            Pengalaman ujian yang tenang,
                                            responsif, dan transparan untuk
                                            membantu melacak perkembangan
                                            belajar secara mandiri.
                                        </p>

                                        {/* Sub-Kelebihan Siswa */}
                                        <ul className="mt-6 space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <li className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <HiOutlineShieldCheck className="size-5 shrink-0 text-blue-500" />
                                                <span>
                                                    <strong>
                                                        Ujian Aman
                                                        (Anti-Curang):
                                                    </strong>{" "}
                                                    Sistem mendeteksi aktivitas
                                                    keluar tab untuk menjaga
                                                    integritas pengerjaan
                                                    evaluasi.
                                                </span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <HiOutlineChartBar className="size-5 shrink-0 text-blue-500" />
                                                <span>
                                                    <strong>
                                                        Grafik Perkembangan:
                                                    </strong>{" "}
                                                    Pantau riwayat nilai latihan
                                                    dan ujian berkala melalui
                                                    grafik performa interaktif.
                                                </span>
                                            </li>
                                            <li className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                                                <HiOutlineUserGroup className="size-5 shrink-0 text-blue-500" />
                                                <span>
                                                    <strong>
                                                        Antarmuka Ramah Gadget:
                                                    </strong>{" "}
                                                    Nyaman diakses baik
                                                    menggunakan laptop, komputer
                                                    madrasah, maupun smartphone.
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </main>

                        {/* FOOTER */}
                        <footer className="py-12 text-center text-xs font-medium text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 dark:text-zinc-500">
                            &copy; {new Date().getFullYear()} - Sistem Informasi
                            Evaluasi Pembelajaran Madrasah. All Rights Reserved.
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
