import AnalyticsFilters from "@/Components/Analytics/AnalyticsFilters";
import AnalyticsRankings, {
    AnalyticsSummaryCards,
} from "@/Components/Analytics/AnalyticsRankings";
import AnalyticsStatisticsTable, {
    groupByLabels,
} from "@/Components/Analytics/AnalyticsStatisticsTable";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
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
} from "react-icons/hi2";

const groupByOptions = [
    { value: "teacher", label: "Guru" },
    { value: "class", label: "Kelas" },
    { value: "subject", label: "Mata Pelajaran" },
    { value: "category", label: "Kategori Mapel" },
    { value: "academic_year", label: "Tahun Akademik" },
    { value: "semester", label: "Semester" },
];

// Map Icon Dinamis sesuai dimensi yang dipilih
const entityConfigs = {
    teacher: { label: "Guru", icon: HiOutlineUser, sub: "NIP / Kode Guru" },
    class: {
        label: "Kelas",
        icon: HiOutlineAcademicCap,
        sub: "Tingkatan Kelas",
    },
    subject: {
        label: "Mata Pelajaran",
        icon: HiOutlineBookOpen,
        sub: "Kode Mapel",
    },
    category: {
        label: "Kategori Mapel",
        icon: HiOutlineFolder,
        sub: "Rumpun Pelajaran",
    },
    academic_year: {
        label: "Tahun Akademik",
        icon: HiOutlineCalendar,
        sub: "Status Periode",
    },
    semester: {
        label: "Semester",
        icon: HiOutlineCalendar,
        sub: "Jenis Semester",
    },
};

export default function Index({
    filters,
    search,
    groupBy,
    summary,
    statistics,
    rankings,
    academicYears,
    semesters,
    teachers,
    kelasList,
    subjects,
    subjectCategories,
    // Dua prop baru di bawah ini dikirim dari controller jika focused_entity_id aktif di URL
    focusedEntity = null,
    focusedStats = null,
}) {
    const handleGroupChange = (nextGroupBy) => {
        router.get(
            route("admin.analytics.index"),
            {
                group_by: nextGroupBy,
                search: search || undefined,
                academic_year_id: filters.academic_year_id || undefined,
                semester_id: filters.semester_id || undefined,
                teacher_id: filters.teacher_id || undefined,
                kelas_id: filters.kelas_id || undefined,
                subject_id: filters.subject_id || undefined,
                subject_category_id: filters.subject_category_id || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    // Tombol kembali untuk menutup detail analitik
    const handleBackToTable = () => {
        router.get(
            route("admin.analytics.index"),
            {
                group_by: groupBy,
                search: search || undefined,
                academic_year_id: filters.academic_year_id || undefined,
                semester_id: filters.semester_id || undefined,
            },
            { preserveState: true },
        );
    };

    // JIKA MODE DETAIL AKTIF (Ada data entity terfokus dari controller)
    if (focusedEntity && focusedStats) {
        const config = entityConfigs[groupBy] || {
            label: "Entitas",
            icon: HiOutlineUser,
            sub: "Detail",
        };
        const EntityIcon = config.icon;

        return (
            <AdminLayout
                title={`Detail Analitik ${config.label}: ${focusedEntity.name}`}
            >
                <Head
                    title={`Detail Analitik ${config.label}: ${focusedEntity.name}`}
                />

                <div className="space-y-6">
                    {/* Header Detail */}
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleBackToTable}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm transition-colors"
                        >
                            <HiOutlineArrowLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                <EntityIcon className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {focusedEntity.name}
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Dimensi {config.label} &bull; {config.sub}:{" "}
                                    {focusedEntity.sub_info || "—"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Skor */}
                    <div className="grid gap-4 sm:grid-cols-3">
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
                                        {formatScore(
                                            focusedStats.average_score,
                                        )}
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
                                        {focusedStats.total_responses}
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
                                        {formatPercent(
                                            focusedStats.response_rate,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Pertanyaan */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                            <h3 className="font-semibold text-slate-800">
                                Statistik Indikator / Pertanyaan pada{" "}
                                {config.label} ini
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
                                    {focusedStats.questions?.map((q) => (
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
                                    {(!focusedStats.questions ||
                                        focusedStats.questions.length ===
                                            0) && (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="px-6 py-10 text-center text-sm text-slate-500"
                                            >
                                                Belum ada data respons kuesioner
                                                pada dimensi ini.
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

    // TAMPILAN DASHBOARD GENERAL (SEMULA)
    return (
        <AdminLayout title="Analitik Evaluasi">
            <Head title="Analitik Evaluasi" />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-slate-600">
                        Analisis statistik evaluasi pembelajaran per guru,
                        kelas, mata pelajaran, kategori, tahun akademik, dan
                        semester.
                    </p>
                </div>

                <AnalyticsFilters
                    academicYears={academicYears}
                    semesters={semesters}
                    teachers={teachers}
                    kelasList={kelasList}
                    subjects={subjects}
                    subjectCategories={subjectCategories}
                    filters={filters}
                    search={search}
                    groupBy={groupBy}
                />

                <AnalyticsSummaryCards summary={summary} />

                <AnalyticsRankings rankings={rankings} />

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <h3 className="text-base font-semibold text-slate-800">
                        Tampilan Statistik
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Pilih dimensi untuk melihat rincian statistik evaluasi.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {groupByOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleGroupChange(option.value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    groupBy === option.value
                                        ? "bg-emerald-600 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                        Dimensi aktif:{" "}
                        <span className="font-semibold text-slate-700">
                            {groupByLabels[groupBy]}
                        </span>
                    </p>
                </div>

                {/* Kirim filter objek saat ini ke tabel agar parameternya tidak hilang saat klik detail */}
                <AnalyticsStatisticsTable
                    statistics={statistics}
                    groupBy={groupBy}
                    currentFilters={filters}
                />
            </div>
        </AdminLayout>
    );
}
