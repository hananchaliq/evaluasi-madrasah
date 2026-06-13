import AdminLayout from '@/Layouts/AdminLayout';
import DashboardAlerts from '@/Components/Dashboard/DashboardAlerts';
import DashboardFilters from '@/Components/Dashboard/DashboardFilters';
import StatCard from '@/Components/Dashboard/StatCard';
import TeacherHighlights from '@/Components/Dashboard/TeacherHighlights';
import { formatNumber, formatPercent, formatScore } from '@/utils/formatters';
import { Head } from '@inertiajs/react';
import {
    HiOutlineAcademicCap,
    HiOutlineChartBar,
    HiOutlineClipboardDocumentCheck,
    HiOutlineClock,
    HiOutlineQueueList,
    HiOutlineStar,
    HiOutlineUsers,
} from 'react-icons/hi2';

export default function Dashboard({
    filters,
    academicYears,
    semesters,
    activeEvaluationPeriod,
    insights,
    overview,
    alerts,
}) {
    const insightCards = [
        {
            label: 'Total Respons',
            value: formatNumber(insights.total_responses),
            description: insights.total_expected
                ? `Dari ${formatNumber(insights.total_expected)} evaluasi yang diharapkan`
                : 'Belum ada penugasan mengajar pada filter ini',
            icon: HiOutlineClipboardDocumentCheck,
            accent: 'emerald',
        },
        {
            label: 'Tingkat Respons',
            value: formatPercent(insights.response_rate),
            description: 'Persentase evaluasi yang telah dikirim',
            icon: HiOutlineChartBar,
            accent: 'blue',
        },
        {
            label: 'Rata-rata Skor Institusi',
            value: formatScore(insights.average_institution_score),
            description: 'Skala penilaian 1 (STS) hingga 5 (SS)',
            icon: HiOutlineStar,
            accent: 'violet',
        },
        {
            label: 'Penyelesaian Evaluasi',
            value: formatPercent(insights.completion_percentage),
            description: 'Persentase siswa yang menyelesaikan semua evaluasi',
            icon: HiOutlineAcademicCap,
            accent: 'amber',
        },
    ];

    const overviewCards = [
        {
            label: 'Tingkatan',
            value: formatNumber(overview.total_tingkatans),
            icon: HiOutlineQueueList,
            accent: 'indigo',
        },
        {
            label: 'Kelas',
            value: formatNumber(overview.total_kelas),
            icon: HiOutlineAcademicCap,
            accent: 'cyan',
        },
        {
            label: 'Guru',
            value: formatNumber(overview.total_teachers),
            icon: HiOutlineUsers,
            accent: 'emerald',
        },
        {
            label: 'Siswa',
            value: formatNumber(overview.total_students),
            icon: HiOutlineUsers,
            accent: 'blue',
        },
        {
            label: 'Evaluasi Tertunda',
            value: formatNumber(overview.pending_evaluations),
            icon: HiOutlineClock,
            accent: 'amber',
        },
        {
            label: 'Evaluasi Terkirim',
            value: formatNumber(overview.submitted_evaluations),
            icon: HiOutlineClipboardDocumentCheck,
            accent: 'rose',
        },
    ];

    return (
        <AdminLayout title="Beranda">
            <Head title="Beranda" />

            <div className="space-y-6">
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6">
                    <h2 className="text-lg font-semibold text-emerald-900">
                        Selamat datang di Sistem Evaluasi Pembelajaran Madrasah
                    </h2>
                    <p className="mt-2 text-sm text-emerald-800">
                        Panel admin MAKN Ende untuk memantau evaluasi pembelajaran
                        berdasarkan tahun akademik dan semester.
                    </p>
                    {activeEvaluationPeriod && (
                        <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-800">
                            <span className="font-semibold">Periode Aktif:</span>
                            <span>{activeEvaluationPeriod.nama}</span>
                            <span className="text-emerald-600">
                                ({activeEvaluationPeriod.academic_year} ·{' '}
                                {activeEvaluationPeriod.semester})
                            </span>
                            {activeEvaluationPeriod.is_locked && (
                                <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                                    Terkunci
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <DashboardAlerts alerts={alerts} />

                <DashboardFilters
                    academicYears={academicYears}
                    semesters={semesters}
                    filters={filters}
                />

                <div>
                    <h3 className="mb-4 text-base font-semibold text-slate-800">
                        Wawasan Evaluasi
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {insightCards.map((card) => (
                            <StatCard key={card.label} {...card} />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-base font-semibold text-slate-800">
                        Sorotan Guru
                    </h3>
                    <TeacherHighlights insights={insights} />
                </div>

                <div>
                    <h3 className="mb-4 text-base font-semibold text-slate-800">
                        Ringkasan Data
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {overviewCards.map((card) => (
                            <StatCard
                                key={card.label}
                                {...card}
                                description={null}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
