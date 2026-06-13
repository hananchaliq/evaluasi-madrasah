import Pagination from '@/Components/Pagination';
import { formatNumber, formatScore } from '@/utils/formatters';

const groupByLabels = {
    teacher: 'Guru',
    class: 'Kelas',
    subject: 'Mata Pelajaran',
    category: 'Kategori Mapel',
};

export default function ReportStatisticsTable({ statistics, groupBy }) {
    const labelHeader = groupByLabels[groupBy] || 'Entitas';

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold text-slate-800">
                    Rincian Laporan per {labelHeader}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Data evaluasi yang sudah dikirim berdasarkan filter aktif.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                No
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                {labelHeader}
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Rata-rata Skor
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Skor Tertinggi
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Skor Terendah
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
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
                                    Belum ada data laporan evaluasi untuk filter
                                    ini.
                                </td>
                            </tr>
                        ) : (
                            statistics.data.map((row, index) => (
                                <tr key={row.entity_id}>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {(statistics.from ?? 1) + index}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-slate-800 print:px-2 print:py-2">
                                        {row.label}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-emerald-700 print:px-2 print:py-2">
                                        {formatScore(row.average_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {formatScore(row.highest_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {formatScore(row.lowest_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {formatNumber(row.total_responses)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {statistics.data.length > 0 && (
                <div className="no-print border-t border-slate-200 px-6 py-4">
                    <Pagination links={statistics.links} />
                </div>
            )}
        </div>
    );
}
