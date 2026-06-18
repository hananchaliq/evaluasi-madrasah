import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { HiOutlineChartBar, HiOutlineCheckCircle, HiOutlineUser } from 'react-icons/hi2';

// We reuse AdminLayout for Teachers for consistency if it's built to be generic enough
// or we can create TeacherLayout. For now, AdminLayout/Sidebar handles role-based menus.

export default function Dashboard({ teacher, activePeriod, stats }) {
    return (
        <AdminLayout title="Panel Guru">
            <Head title="Dashboard Guru" />

            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <HiOutlineUser className="h-9 w-9" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    Selamat Datang, {teacher.nama}!
                                </h3>
                                <p className="text-slate-600">
                                    Lihat hasil evaluasi pembelajaran Anda semester ini.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-blue-50 p-4 text-blue-600">
                                <HiOutlineCheckCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Evaluasi</p>
                                <p className="text-3xl font-bold text-slate-800">{stats.total_evaluations}</p>
                                <p className="text-xs text-slate-400 mt-1">Periode: {activePeriod?.nama || '-'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-emerald-50 p-4 text-emerald-600">
                                <HiOutlineChartBar className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Rerata Skor</p>
                                <p className="text-3xl font-bold text-emerald-600">{stats.average_score}</p>
                                <p className="text-xs text-slate-400 mt-1">Berdasarkan responden</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link 
                        href={route('teacher.evaluation-results.index')}
                        className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
                    >
                        Lihat Detail Hasil Evaluasi
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
