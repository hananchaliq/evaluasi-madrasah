import Pagination from '@/Components/Pagination';
import { formatNumber, formatScore } from '@/utils/formatters';

const groupByLabels = {
    teacher: 'Guru',
    class: 'Kelas',
    subject: 'Mata Pelajaran',
    category: 'Kategori Mapel',
    academic_year: 'Tahun Akademik',
    semester: 'Semester',
};

export default function AnalyticsStatisticsTable({ statistics, groupBy }) {
    const labelHeader = groupByLabels[groupBy] || 'Entitas';

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold text-slate-800">
                    Statistik per {labelHeader}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Rincian metrik evaluasi berdasarkan dimensi yang dipilih.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                No
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                {labelHeader}
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Rata-rata Skor
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Skor Tertinggi
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Skor Terendah
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Total Respons
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {statistics.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-10 text-center text-sm text-slate-500"
                                >
                                    Belum ada data statistik evaluasi untuk
                                    filter ini.
                                </td>
                            </tr>
                        ) : (
                            statistics.data.map((row, index) => (
                                <tr key={row.entity_id} className="hover:bg-slate-50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {(statistics.from ?? 1) + index}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {row.label}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-700">
                                        {formatScore(row.average_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {formatScore(row.highest_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {formatScore(row.lowest_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {formatNumber(row.total_responses)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {statistics.data.length > 0 && (
                <div className="border-t border-slate-200 px-6 py-4">
                    <Pagination links={statistics.links} />
                </div>
            )}
        </div>
    );
}

export { groupByLabels };
