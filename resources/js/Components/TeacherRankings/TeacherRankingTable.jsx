import Pagination from '@/Components/Pagination';
import { formatNumber, formatScore } from '@/utils/formatters';
import { HiOutlineArrowTrendingDown, HiOutlineArrowTrendingUp } from 'react-icons/hi2';

export default function TeacherRankingTable({ rankings, rankingType }) {
    const isLowest = rankingType === 'lowest';

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold text-slate-800">
                    {isLowest
                        ? 'Daftar Guru Rating Terendah'
                        : 'Daftar Peringkat Guru'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Urutan berdasarkan rata-rata skor evaluasi siswa.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Peringkat
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Guru
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
                        {rankings.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-10 text-center text-sm text-slate-500"
                                >
                                    Belum ada data peringkat guru.
                                </td>
                            </tr>
                        ) : (
                            rankings.data.map((row) => (
                                <tr key={row.teacher_id} className="hover:bg-slate-50">
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                                            #{row.rank}
                                            {row.rank === 1 && !isLowest && (
                                                <HiOutlineArrowTrendingUp className="h-4 w-4 text-emerald-600" />
                                            )}
                                            {isLowest && row.rank === 1 && (
                                                <HiOutlineArrowTrendingDown className="h-4 w-4 text-rose-600" />
                                            )}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                                        {row.teacher_name}
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

            {rankings.data.length > 0 && (
                <div className="border-t border-slate-200 px-6 py-4">
                    <Pagination links={rankings.links} />
                </div>
            )}
        </div>
    );
}
