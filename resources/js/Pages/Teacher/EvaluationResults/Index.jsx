import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { HiOutlineChartPie, HiOutlineDocumentText, HiOutlineUserGroup } from 'react-icons/hi2';

export default function Index({ filters, academicYears, semesters, stats }) {
    const handleFilterChange = (key, value) => {
        router.get(route('teacher.evaluation-results.index'), {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
        });
    };

    return (
        <AdminLayout title="Hasil Evaluasi">
            <Head title="Hasil Evaluasi" />

            <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center">
                    <div className="flex-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tahun Akademik</label>
                        <select 
                            value={filters.academic_year_id} 
                            onChange={(e) => handleFilterChange('academic_year_id', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            {academicYears.map(year => (
                                <option key={year.id} value={year.id}>{year.nama}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Semester</label>
                        <select 
                            value={filters.semester_id} 
                            onChange={(e) => handleFilterChange('semester_id', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                            {semesters.map(sem => (
                                <option key={sem.id} value={sem.id}>{sem.nama}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Summary Info */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl bg-emerald-600 p-8 text-white shadow-lg">
                        <HiOutlineChartPie className="h-10 w-10 opacity-50" />
                        <p className="mt-4 text-emerald-100 font-medium">Rata-rata Skor Keseluruhan</p>
                        <p className="text-5xl font-bold mt-1">{stats.average_score}</p>
                        <div className="mt-6 flex items-center gap-2 text-sm text-emerald-100">
                            <HiOutlineUserGroup className="h-4 w-4" />
                            <span>{stats.total_responses} Responden</span>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Informasi Evaluasi</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <HiOutlineDocumentText className="h-5 w-5 text-slate-400 mt-0.5" />
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Hasil evaluasi ini berasal dari input anonim siswa yang Anda ajar pada periode terpilih.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-500 border border-slate-100">
                                <strong>Catatan:</strong> Data hanya ditampilkan untuk evaluasi yang sudah berstatus "Submitted".
                            </div>
                        </div>
                    </div>
                </div>

                {/* Per Question Table */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h3 className="font-bold text-slate-800">Skor per Unsur Penilaian</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-3">Pertanyaan / Unsur Penilaian</th>
                                    <th className="px-6 py-3 text-center">Skor Rerata</th>
                                    <th className="px-6 py-3">Visualisasi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {stats.questions.map((q) => (
                                    <tr key={q.id}>
                                        <td className="px-6 py-4 text-slate-700 font-medium">{q.pertanyaan}</td>
                                        <td className="px-6 py-4 text-center font-bold text-slate-900">
                                            {Number(q.avg_score).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${
                                                        q.avg_score >= 4 ? 'bg-emerald-500' : 
                                                        q.avg_score >= 3 ? 'bg-blue-500' : 
                                                        'bg-amber-500'
                                                    }`}
                                                    style={{ width: `${(q.avg_score / 5) * 100}%` }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
