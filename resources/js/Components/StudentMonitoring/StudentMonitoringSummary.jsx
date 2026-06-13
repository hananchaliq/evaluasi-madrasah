import StatCard from '@/Components/Dashboard/StatCard';
import { formatNumber, formatPercent } from '@/utils/formatters';
import {
    HiOutlineAcademicCap,
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineUsers,
} from 'react-icons/hi2';

export default function StudentMonitoringSummary({ summary }) {
    const cards = [
        {
            label: 'Total Siswa',
            value: formatNumber(summary.total_students),
            description: `${formatNumber(summary.completed_students)} siswa selesai evaluasi`,
            icon: HiOutlineUsers,
            accent: 'blue',
        },
        {
            label: 'Evaluasi Terkirim',
            value: formatNumber(summary.submitted_evaluations),
            description: 'Total evaluasi yang sudah dikirim',
            icon: HiOutlineCheckCircle,
            accent: 'emerald',
        },
        {
            label: 'Evaluasi Pending',
            value: formatNumber(summary.pending_evaluations),
            description: `${formatNumber(summary.pending_students)} siswa belum mulai`,
            icon: HiOutlineClock,
            accent: 'amber',
        },
        {
            label: 'Penyelesaian',
            value: formatPercent(summary.completion_percentage),
            description: `${formatNumber(summary.in_progress_students)} siswa sedang berjalan`,
            icon: HiOutlineAcademicCap,
            accent: 'violet',
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
                <StatCard key={card.label} {...card} />
            ))}
        </div>
    );
}
