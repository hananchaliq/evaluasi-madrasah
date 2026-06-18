import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import { Head, Link, router } from "@inertiajs/react";
import {
    HiOutlineChartBar,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineUsers,
    HiOutlineEye,
} from "react-icons/hi2";

export default function Index({
    filters,
    academicYears,
    semesters,
    classes, // List kelas dari backend
    activePeriod,
    stats,
    classProgress,
    tableData = { data: [], links: [] },
}) {
    const handleFilterChange = (key, value) => {
        router.get(
            route("admin.evaluation-monitoring.index"),
            {
                ...filters,
                [key]: value === "" ? undefined : value,
            },
            {
                preserveState: true,
            },
        );
    };

    const currentStatus = filters.status || "submitted";

    return (
        <AdminLayout title="Pemantauan Evaluasi">
            <Head title="Pemantauan Evaluasi" />

            <div className="space-y-6">
                {/* Filters Grid */}
                <div className="grid grid-cols-1 gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 md:grid-cols-4 items-end">
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Tahun Akademik
                        </label>
                        <select
                            value={filters.academic_year_id}
                            onChange={(e) =>
                                handleFilterChange(
                                    "academic_year_id",
                                    e.target.value,
                                )
                            }
                            className="mt-1 block w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            {academicYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    {year.nama}{" "}
                                    {year.is_active ? "(Aktif)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Semester
                        </label>
                        <select
                            value={filters.semester_id}
                            onChange={(e) =>
                                handleFilterChange(
                                    "semester_id",
                                    e.target.value,
                                )
                            }
                            className="mt-1 block w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            {semesters.map((sem) => (
                                <option key={sem.id} value={sem.id}>
                                    {sem.nama} {sem.is_active ? "(Aktif)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* BUTTON/SELECT FILTER KELAS BARU */}
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Filter Berdasarkan Kelas
                        </label>
                        <select
                            value={filters.kelas_id || ""}
                            onChange={(e) =>
                                handleFilterChange("kelas_id", e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            <option value="">-- Semua Kelas --</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Status Switch */}
                    <div className="flex flex-col md:items-end">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            Status Evaluasi Utama
                        </label>
                        <div className="inline-flex rounded-lg bg-slate-100 p-1">
                            <button
                                type="button"
                                onClick={() =>
                                    handleFilterChange("status", "submitted")
                                }
                                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                                    currentStatus === "submitted"
                                        ? "bg-white text-emerald-600 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Submitted
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handleFilterChange("status", "draft")
                                }
                                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                                    currentStatus === "draft"
                                        ? "bg-white text-amber-600 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                Draft
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                <HiOutlineUsers className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Siswa
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats.total_students}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div
                                className={`rounded-lg p-3 ${currentStatus === "draft" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                            >
                                <HiOutlineCheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 capitalize">
                                    {currentStatus}
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats.submitted}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
                                <HiOutlineExclamationCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Belum Mengisi
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats.expected - stats.submitted}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                                <HiOutlineChartBar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Persentase
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats.percentage}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 items-start">
                    {/* Progress by Class (Kiri) */}
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-2">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-bold text-slate-800">
                                Kemajuan per Kelas ({currentStatus})
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {classProgress.map((item) => (
                                <div key={item.id} className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <span className="font-bold text-slate-800">
                                                {item.nama}
                                            </span>
                                            <span className="ml-2 text-xs text-slate-500">
                                                ({item.tingkatan})
                                            </span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">
                                            {item.submitted}/{item.expected}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${
                                                currentStatus === "draft"
                                                    ? "bg-amber-500"
                                                    : "bg-emerald-500"
                                            }`}
                                            style={{
                                                width: `${item.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Utama Kanan */}
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 lg:col-span-3">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-bold text-slate-800">
                                {currentStatus === "draft"
                                    ? "Daftar Siswa (Status: Draft)"
                                    : "Ringkasan Evaluasi Guru"}
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    {currentStatus === "draft" ? (
                                        // HEADER DRAFT (+ KOLOM KELAS TERPISAH)
                                        <tr>
                                            <th className="px-6 py-3">
                                                Nama Siswa
                                            </th>
                                            <th className="px-6 py-3">Kelas</th>
                                            <th className="px-6 py-3">
                                                Target Guru / Mapel
                                            </th>
                                            <th className="px-6 py-3 text-center">
                                                Belum Diisi
                                            </th>
                                        </tr>
                                    ) : (
                                        // HEADER AWAL KETIKA STATUS SUBMITTED (GURU)
                                        <tr>
                                            <th className="px-6 py-3">Guru</th>
                                            <th className="px-6 py-3">
                                                Mata Pelajaran
                                            </th>
                                            <th className="px-6 py-3 text-center">
                                                Total Responden
                                            </th>
                                            <th className="px-6 py-3 text-center">
                                                Rata-rata Skor
                                            </th>
                                            <th className="px-6 py-3 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    )}
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {!tableData?.data ||
                                    tableData?.data?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={
                                                    currentStatus === "draft"
                                                        ? "4"
                                                        : "5"
                                                }
                                                className="px-6 py-10 text-center text-slate-500"
                                            >
                                                Tidak ada data pemantauan.
                                            </td>
                                        </tr>
                                    ) : (
                                        tableData?.data?.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="hover:bg-slate-50"
                                            >
                                                {currentStatus === "draft" ? (
                                                    // BODY DATA SISWA INDIVIDUAL DENGAN KOLOM KELAS NYATA
                                                    <>
                                                        <td className="px-6 py-4 font-bold text-slate-800">
                                                            {row.student_nama}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-slate-600">
                                                            {row.kelas_nama}
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-700">
                                                            <div className="font-semibold text-slate-800">
                                                                {
                                                                    row.teacher_nama
                                                                }
                                                            </div>
                                                            <div className="text-xs text-slate-400">
                                                                {
                                                                    row.subject_nama
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                                                                {
                                                                    row.unanswered_questions
                                                                }{" "}
                                                                Pertanyaan
                                                            </span>
                                                        </td>
                                                    </>
                                                ) : (
                                                    // BODY TABEL GURU SEMULA KETIKA SUBMITTED
                                                    <>
                                                        <td className="px-6 py-4 font-bold text-slate-800">
                                                            {row.nama}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {row.subjects?.map(
                                                                    (
                                                                        subject,
                                                                        idx,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600"
                                                                        >
                                                                            {
                                                                                subject
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center text-slate-600 font-medium">
                                                            {
                                                                row.total_evaluators
                                                            }{" "}
                                                            Siswa
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                                                    row.average_score >=
                                                                    4
                                                                        ? "bg-emerald-100 text-emerald-800"
                                                                        : row.average_score >=
                                                                            3
                                                                          ? "bg-blue-100 text-blue-800"
                                                                          : "bg-rose-100 text-rose-800"
                                                                }`}
                                                            >
                                                                {
                                                                    row.average_score
                                                                }{" "}
                                                                / 5
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <Link
                                                                href={route(
                                                                    "admin.evaluation-monitoring.show",
                                                                    row.id,
                                                                )}
                                                                data={{
                                                                    academic_year_id:
                                                                        filters.academic_year_id,
                                                                    semester_id:
                                                                        filters.semester_id,
                                                                    status: currentStatus,
                                                                }}
                                                                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-900"
                                                            >
                                                                <HiOutlineEye className="w-4 h-4" />{" "}
                                                                Detail
                                                            </Link>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {tableData?.data?.length > 0 && (
                            <div className="border-t border-slate-200 px-6 py-4">
                                <Pagination links={tableData.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
