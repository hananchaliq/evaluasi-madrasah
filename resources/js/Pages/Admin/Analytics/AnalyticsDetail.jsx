import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { formatPercent, formatScore } from "@/utils/formatters";
import {
    HiOutlineArrowLeft,
    HiOutlineChartBar,
    HiOutlineStar,
    HiOutlineUser,
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineFolder,
    HiOutlineCalendar,
    HiOutlineClipboardDocumentList,
} from "react-icons/x-hi2"; // Gunakan library icon andalanmu bre, jika hi2 langsung dari 'react-icons/hi2'

const groupByLabels = {
    teacher: {
        label: "Guru",
        icon: HiOutlineUser,
        subField: "NIP / Kode Guru",
    },
    class: {
        label: "Kelas",
        icon: HiOutlineAcademicCap,
        subField: "Tingkatan Kelas",
    },
    subject: {
        label: "Mata Pelajaran",
        icon: HiOutlineBookOpen,
        subField: "Kode Mapel",
    },
    category: {
        label: "Kategori Mapel",
        icon: HiOutlineFolder,
        subField: "Rumpun Pelajaran",
    },
    academic_year: {
        label: "Tahun Akademik",
        icon: HiOutlineCalendar,
        subField: "Status Periode",
    },
    semester: {
        label: "Semester",
        icon: HiOutlineCalendar,
        subField: "Jenis Semester",
    },
};

export default function AnalyticsDetail({ entity, groupBy, stats }) {
    // Ambil konfigurasi visual berdasarkan dimensi yang aktif
    const config = groupByLabels[groupBy] || {
        label: "Entitas",
        icon: HiOutlineUser,
        subField: "Detail",
    };
    const EntityIcon = config.icon;

    return (
        <AdminLayout title={`Detail Analitik ${config.label}: ${entity.name}`}>
            <Head title={`Detail Analitik ${config.label}: ${entity.name}`} />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                    <Link
                        href={route("admin.analytics.index")} // Sesuaikan dengan nama rute halaman analytics-mu
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
                    >
                        <HiOutlineArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <EntityIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {entity.name}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Dimensi {config.label} &bull; {config.subField}:{" "}
                                {entity.sub_info || "—"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Score Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                                <HiOutlineStar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Skor Rata-rata
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {formatScore(stats.average_score)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                                <HiOutlineClipboardDocumentList className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Total Respons
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {stats.total_responses}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                                <HiOutlineChartBar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    Tingkat Respons
                                </p>
                                <p className="text-2xl font-bold text-slate-800">
                                    {formatPercent(stats.response_rate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Statistics Table */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                        <h3 className="font-semibold text-slate-800">
                            Statistik Indikator / Pertanyaan pada {config.label}{" "}
                            ini
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Pertanyaan / Indikator Evaluasi
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">
                                        Rata-rata Skor
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">
                                        Total Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {stats.questions &&
                                    stats.questions.map((q) => (
                                        <tr key={q.id}>
                                            <td className="px-6 py-4 text-sm text-slate-800">
                                                {q.pertanyaan}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold ${
                                                        q.avg_score >= 4
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : q.avg_score >= 3
                                                              ? "bg-blue-100 text-blue-700"
                                                              : "bg-amber-100 text-amber-700"
                                                    }`}
                                                >
                                                    {formatScore(q.avg_score)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm text-slate-600 whitespace-nowrap">
                                                {q.total}
                                            </td>
                                        </tr>
                                    ))}
                                {(!stats.questions ||
                                    stats.questions.length === 0) && (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            Belum ada data respons   kuesioner
                                            yang terekam pada dimensi ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
