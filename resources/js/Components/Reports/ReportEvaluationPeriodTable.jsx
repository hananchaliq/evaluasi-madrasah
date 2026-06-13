import Pagination from '@/Components/Pagination';
import { formatNumber, formatPercent, formatScore } from '@/utils/formatters';
import { formatPeriodRange } from '@/Components/Reports/ReportPrintHeader';

export default function ReportEvaluationPeriodTable({ statistics }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm print:break-inside-avoid">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold text-slate-800">
                    Rincian Laporan per Periode Evaluasi
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Statistik evaluasi untuk setiap periode evaluasi yang
                    sesuai filter.
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
                                Periode
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Tahun / Semester
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Rentang Tanggal
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Status
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Rata-rata
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Respons
                            </th>
                            <th className="px-4 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600 print:px-2 print:py-2">
                                Tingkat Respons
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {statistics.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="px-6 py-10 text-center text-sm text-slate-500"
                                >
                                    Belum ada data periode evaluasi untuk filter
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
                                    <td className="px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {row.academic_year} · {row.semester}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {formatPeriodRange(
                                            row.start_date,
                                            row.end_date,
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm print:px-2 print:py-2">
                                        <div className="flex flex-wrap gap-1">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    row.is_active
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {row.is_active
                                                    ? 'Aktif'
                                                    : 'Tidak Aktif'}
                                            </span>
                                            {row.is_locked && (
                                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                                    Terkunci
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-emerald-700 print:px-2 print:py-2">
                                        {formatScore(row.average_score)}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {formatNumber(row.total_responses)}
                                        <span className="text-xs text-slate-400">
                                            {' '}
                                            / {formatNumber(row.expected_responses)}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 print:px-2 print:py-2">
                                        {formatPercent(row.response_rate)}
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
