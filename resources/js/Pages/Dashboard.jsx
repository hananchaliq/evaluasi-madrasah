import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import {
    HiOutlineAcademicCap,
    HiOutlineChartBar,
    HiOutlineClipboardDocumentCheck,
    HiOutlineUsers,
} from 'react-icons/hi2';

const statCards = [
    {
        label: 'Total Respons',
        value: '—',
        description: 'Data evaluasi belum tersedia',
        icon: HiOutlineClipboardDocumentCheck,
        color: 'bg-emerald-500',
    },
    {
        label: 'Tingkat Penyelesaian',
        value: '—',
        description: 'Menunggu periode evaluasi aktif',
        icon: HiOutlineChartBar,
        color: 'bg-blue-500',
    },
    {
        label: 'Total Guru',
        value: '—',
        description: 'Modul data guru belum diaktifkan',
        icon: HiOutlineAcademicCap,
        color: 'bg-violet-500',
    },
    {
        label: 'Total Siswa',
        value: '—',
        description: 'Modul data siswa belum diaktifkan',
        icon: HiOutlineUsers,
        color: 'bg-amber-500',
    },
];

export default function Dashboard() {
    return (
        <AdminLayout title="Beranda">
            <Head title="Beranda" />

            <div className="space-y-6">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                    <h2 className="text-lg font-semibold text-emerald-900">
                        Selamat datang di Sistem Evaluasi Pembelajaran Madrasah
                    </h2>
                    <p className="mt-2 text-sm text-emerald-800">
                        Panel admin MAKN Ende siap digunakan. Gunakan menu
                        sidebar untuk mengelola data master, evaluasi, analitik,
                        dan laporan setelah modul-modul tersebut diimplementasikan.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.label}
                                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            {card.label}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-slate-800">
                                            {card.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`rounded-lg p-2.5 text-white ${card.color}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    {card.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-base font-semibold text-slate-800">
                        Status Pengembangan
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Layout admin dan sidebar telah aktif. Modul CRUD dan
                        fitur evaluasi akan ditambahkan sesuai urutan
                        pengembangan pada AI_CONTEXT.md.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
}
