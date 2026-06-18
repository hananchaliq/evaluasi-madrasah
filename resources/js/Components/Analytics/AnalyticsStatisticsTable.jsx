import Pagination from "@/Components/Pagination";
import { formatNumber, formatScore } from "@/utils/formatters";
import { router } from "@inertiajs/react";
import { HiOutlineEye } from "react-icons/hi2";

const groupByLabels = {
    teacher: "Guru",
    class: "Kelas",
    subject: "Mata Pelajaran",
    category: "Kategori Mapel",
    academic_year: "Tahun Akademik",
    semester: "Semester",
};

export default function AnalyticsStatisticsTable({
    statistics,
    groupBy,
    currentFilters,
}) {
    const labelHeader = groupByLabels[groupBy] || "Entitas";

    const handleViewDetail = (entityId) => {
        router.get(
            route("admin.analytics.index"),
            {
                ...currentFilters,
                group_by: groupBy,
                focused_entity_id: entityId,
            },
            { preserveState: true },
        );
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header Tabel: Padding disesuaikan agar fleksibel di mobile */}
            <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
                <h3 className="text-base font-semibold text-slate-800">
                    Statistik per {labelHeader}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Rincian metrik evaluasi berdasarkan dimensi yang dipilih.
                </p>
            </div>

            {/* Wrapper Scroll Horizontal Otomatis dengan Touch Support */}
            <div className="w-full overflow-x-auto scrollbar-thin overflow-y-hidden [webkit-overflow-scrolling:touch]">
                {/* min-w-[800px] memaksa tabel mempertahankan layout kolomnya yang rapi di layar kecil */}
                <table className="min-w-[800px] w-full divide-y divide-slate-200 table-fixed sm:table-auto">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 sm:px-6 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 w-16">
                                No
                            </th>
                            <th className="px-4 py-3 sm:px-6 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 w-1/4">
                                {labelHeader}
                            </th>
                            <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Rata-rata Skor
                            </th>
                            <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Skor Tertinggi
                            </th>
                            <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Skor Terendah
                            </th>
                            <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Total Respons
                            </th>
                            <th className="px-4 py-3 sm:px-6 text-center text-xs font-semibold uppercase tracking-wider text-slate-600 w-24">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {statistics.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="px-4 py-10 sm:px-6 text-center text-sm text-slate-500"
                                >
                                    Belum ada data statistik evaluasi untuk
                                    filter ini.
                                </td>
                            </tr>
                        ) : (
                            statistics.data.map((row, index) => (
                                <tr
                                    key={row.entity_id}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    {/* Kolom No */}
                                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-sm text-slate-600 text-start">
                                        {(statistics.from ?? 1) + index}
                                    </td>
                                    {/* Kolom Nama / Label (Bisa membungkus text jika terlalu panjang) */}
                                    <td className="px-4 py-4 sm:px-6 text-sm font-medium text-slate-800 text-start break-words">
                                        {row.label}
                                    </td>
                                    {/* Kolom Rata-rata Skor */}
                                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-sm font-semibold text-emerald-700 text-center">
                                        {formatScore(row.average_score)}
                                    </td>
                                    {/* Kolom Skor Tertinggi */}
                                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-sm text-slate-600 text-center">
                                        {formatScore(row.highest_score)}
                                    </td>
                                    {/* Kolom Skor Terendah */}
                                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-sm text-slate-600 text-center">
                                        {formatScore(row.lowest_score)}
                                    </td>
                                    {/* Kolom Total Respons */}
                                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-sm text-slate-600 text-center">
                                        {formatNumber(row.total_responses)}
                                    </td>
                                    {/* Kolom Aksi */}
                                    <td className="whitespace-nowrap px-4 py-4 sm:px-6 text-center text-sm">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleViewDetail(row.entity_id)
                                            }
                                            className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-900 mx-auto transition-colors"
                                        >
                                            <HiOutlineEye className="h-4 w-4" />{" "}
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Wrapper: Responsif untuk layar kecil */}
            {statistics.data.length > 0 && (
                <div className="border-t border-slate-200 px-4 py-4 sm:px-6 flex justify-center sm:justify-end">
                    <Pagination links={statistics.links} />
                </div>
            )}
        </div>
    );
}

export { groupByLabels };
