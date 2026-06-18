import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { HiOutlineAcademicCap, HiOutlineCheckBadge, HiOutlineClipboardDocumentCheck, HiOutlineClock, HiOutlineUser } from 'react-icons/hi2';

export default function Dashboard({ student, activePeriod, teachers, stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Panel Siswa
                </h2>
            }
        >
            <Head title="Dashboard Siswa" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Welcome Card */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                        <HiOutlineUser className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">
                                            Selamat Datang, {student.nama}!
                                        </h3>
                                        <p className="text-sm text-slate-600">
                                            Kelola evaluasi pembelajaran Anda untuk semester ini.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end text-sm">
                                    <p className="font-semibold text-slate-800">{student.kelas?.nama}</p>
                                    <p className="text-slate-500">{student.kelas?.tingkatan?.nama}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 gap-px bg-slate-100 sm:grid-cols-3">
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <HiOutlineAcademicCap className="h-5 w-5 text-slate-400" />
                                    <p className="text-sm font-medium text-slate-500">Total Guru</p>
                                </div>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total_teachers}</p>
                            </div>
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <HiOutlineCheckBadge className="h-5 w-5 text-emerald-500" />
                                    <p className="text-sm font-medium text-slate-500">Evaluasi Selesai</p>
                                </div>
                                <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.completed}</p>
                            </div>
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-3">
                                    <HiOutlineClock className="h-5 w-5 text-amber-500" />
                                    <p className="text-sm font-medium text-slate-500">Belum Selesai</p>
                                </div>
                                <p className="mt-2 text-3xl font-bold text-amber-600">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    {/* Active Period Info */}
                    {activePeriod && (
                        <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex items-start gap-3">
                                <HiOutlineClipboardDocumentCheck className="mt-0.5 h-5 w-5 text-blue-600" />
                                <div>
                                    <h4 className="font-bold text-blue-900">Periode Evaluasi Aktif: {activePeriod.nama}</h4>
                                    <p className="mt-1 text-sm text-blue-800">
                                        Silakan isi evaluasi untuk semua guru yang mengajar di kelas Anda. Evaluasi bersifat rahasia dan digunakan untuk peningkatan kualitas pembelajaran.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Teacher Cards */}
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {teachers.map((item) => (
                            <div key={item.teacher.id} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md hover:ring-emerald-300">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                                        <HiOutlineUser className="h-6 w-6" />
                                    </div>
                                    <div className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        item.status === 'submitted' 
                                        ? 'bg-emerald-100 text-emerald-700' 
                                        : item.status === 'draft'
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {item.status === 'submitted' ? 'Selesai' : item.status === 'draft' ? 'Draft' : 'Belum Mulai'}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="font-bold text-slate-800">{item.teacher.nama}</h5>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {item.subjects.map((sub, idx) => (
                                            <span key={idx} className="text-xs text-slate-500">
                                                {sub}{idx < item.subjects.length - 1 ? ' • ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {item.status === 'submitted' ? (
                                        <button disabled className="w-full rounded-xl bg-slate-100 py-2.5 text-sm font-bold text-slate-400">
                                            Selesai Terkirim
                                        </button>
                                    ) : (
                                        <Link 
                                            href={route('student.evaluations.create', item.teacher.id)}
                                            className="block w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
                                        >
                                            {item.status === 'draft' ? 'Lanjutkan Evaluasi' : 'Isi Evaluasi'}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {teachers.length === 0 && (
                        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                            <HiOutlineAcademicCap className="h-16 w-16 text-slate-200" />
                            <h3 className="mt-4 text-lg font-bold text-slate-800">Tidak ada penugasan guru</h3>
                            <p className="mt-2 max-w-sm text-slate-500">
                                Belum ada daftar guru yang ditugaskan di kelas Anda untuk periode saat ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
