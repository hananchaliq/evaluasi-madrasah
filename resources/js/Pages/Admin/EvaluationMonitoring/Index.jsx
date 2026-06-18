import AdminLayout from "@/Layouts/AdminLayout";
// 1. IMPORT KOMPONEN PAGINATION
import Pagination from "@/Components/Pagination";
import { Head, Link, router } from "@inertiajs/react";
import {
    HiOutlineChartBar,
    HiOutlineCheckCircle,
    HiOutlineExclamationCircle,
    HiOutlineUserGroup,
    HiOutlineUsers,
} from "react-icons/hi2";

export default function Index({
    filters,
    academicYears,
    semesters,
    activePeriod,
    stats,
    classProgress,
    teacherSummaries,
}) {
    const handleFilterChange = (key, value) => {
        router.get(
            route("admin.evaluation-monitoring.index"),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
            },
        );
    };

    return (
        <AdminLayout title="Pemantauan Evaluasi">
            <Head title="Pemantauan Evaluasi" />

            <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
                    <div className="flex-1">
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
                    <div className="flex-1">
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
                            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                                <HiOutlineCheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Terkirim
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
                                    Menunggu
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

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
                    {/* Progress by Class */}
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-bold text-slate-800">
                                Kemajuan per Kelas
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
                                            className="h-full bg-emerald-500 transition-all duration-500"
                                            style={{
                                                width: `${item.percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Teacher Summary */}
                    <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="border-b border-slate-100 px-6 py-4">
                            <h3 className="font-bold text-slate-800">
                                Ringkasan Evaluasi Guru
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3">Nama Guru</th>
                                        <th className="px-6 py-3 text-center">
                                            Responden
                                        </th>
                                        <th className="px-6 py-3 text-center">
                                            Skor Rerata
                                        </th>
                                        <th className="px-6 py-3">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* 2. UBAH MAP KE DATA PAGINATION (teacherSummaries.data) */}
                                    {teacherSummaries.data &&
                                    teacherSummaries.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-10 text-center text-slate-500"
                                            >
                                                Belum ada data evaluasi guru.
                                            </td>
                                        </tr>
                                    ) : (
                                        teacherSummaries.data?.map(
                                            (teacher) => (
                                                <tr
                                                    key={teacher.id}
                                                    className="hover:bg-slate-50"
                                                >
                                                    <td className="px-6 py-4 font-medium text-slate-800">
                                                        {teacher.nama}
                                                        <div className="text-xs font-normal text-slate-500">
                                                            {teacher.subjects?.join(
                                                                ", ",
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {
                                                            teacher.total_evaluators
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ${
                                                                teacher.average_score >=
                                                                4
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : teacher.average_score >=
                                                                        3
                                                                      ? "bg-blue-100 text-blue-700"
                                                                      : teacher.average_score >
                                                                          0
                                                                        ? "bg-amber-100 text-amber-700"
                                                                        : "bg-slate-100 text-slate-500"
                                                            }`}
                                                        >
                                                            {teacher.average_score ||
                                                                "-"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={route(
                                                                "admin.evaluation-monitoring.show",
                                                                {
                                                                    teacher:
                                                                        teacher.id,
                                                                    academic_year_id:
                                                                        filters.academic_year_id,
                                                                    semester_id:
                                                                        filters.semester_id,
                                                                },
                                                            )}
                                                            className="text-emerald-600 hover:text-emerald-700 font-bold"
                                                        >
                                                            Detail
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 3. TAMBAHKAN PAGINATION DI BAWAH TABEL */}
                        {teacherSummaries.data &&
                            teacherSummaries.data.length > 0 && (
                                <div className="border-t border-slate-200 px-6 py-4">
                                    <Pagination
                                        links={teacherSummaries.links}
                                    />
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
