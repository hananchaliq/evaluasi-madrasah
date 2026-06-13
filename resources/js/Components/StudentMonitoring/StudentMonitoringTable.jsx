import Pagination from '@/Components/Pagination';
import { formatNumber, formatPercent } from '@/utils/formatters';

const statusStyles = {
    completed: 'bg-emerald-100 text-emerald-700',
    in_progress: 'bg-amber-100 text-amber-700',
    pending: 'bg-rose-100 text-rose-700',
    no_assignment: 'bg-slate-100 text-slate-600',
};

const statusLabels = {
    completed: 'Selesai',
    in_progress: 'Sedang Berjalan',
    pending: 'Belum Mulai',
    no_assignment: 'Tanpa Penugasan',
};

export default function StudentMonitoringTable({ students }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold text-slate-800">
                    Daftar Pemantauan Siswa
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Progres evaluasi setiap siswa berdasarkan penugasan mengajar.
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
                                Siswa
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Kelas
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Target
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Terkirim
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Draft
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Pending
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Progres
                            </th>
                            <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {students.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="px-6 py-10 text-center text-sm text-slate-500"
                                >
                                    Tidak ada data siswa yang sesuai dengan
                                    filter.
                                </td>
                            </tr>
                        ) : (
                            students.data.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-slate-50"
                                >
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {(students.from ?? 1) + index}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <p className="font-medium text-slate-800">
                                            {student.nama}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            NIS: {student.nis}
                                        </p>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {student.kelas
                                            ? `${student.kelas.tingkatan ? `${student.kelas.tingkatan} ` : ''}${student.kelas.nama}`
                                            : '—'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        {formatNumber(
                                            student.required_evaluations,
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-emerald-700">
                                        {formatNumber(
                                            student.submitted_evaluations,
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-amber-700">
                                        {formatNumber(student.draft_evaluations)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-rose-700">
                                        {formatNumber(
                                            student.pending_evaluations,
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{
                                                        width: `${Math.min(student.completion_percentage, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                            <span>
                                                {formatPercent(
                                                    student.completion_percentage,
                                                )}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[student.status]}`}
                                        >
                                            {statusLabels[student.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {students.data.length > 0 && (
                <div className="border-t border-slate-200 px-6 py-4">
                    <Pagination links={students.links} />
                </div>
            )}
        </div>
    );
}
