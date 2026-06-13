import { formatScore } from '@/utils/formatters';
import {
    HiOutlineArrowTrendingDown,
    HiOutlineArrowTrendingUp,
    HiOutlineUserGroup,
} from 'react-icons/hi2';

const cards = [
    {
        key: 'highest_rated_teacher',
        title: 'Guru Rating Tertinggi',
        icon: HiOutlineArrowTrendingUp,
        accent: 'border-emerald-200 bg-emerald-50',
        iconColor: 'text-emerald-600',
        formatValue: (teacher) => formatScore(teacher.value),
        suffix: 'skor rata-rata',
    },
    {
        key: 'lowest_rated_teacher',
        title: 'Guru Rating Terendah',
        icon: HiOutlineArrowTrendingDown,
        accent: 'border-rose-200 bg-rose-50',
        iconColor: 'text-rose-600',
        formatValue: (teacher) => formatScore(teacher.value),
        suffix: 'skor rata-rata',
    },
    {
        key: 'most_evaluated_teacher',
        title: 'Guru Paling Banyak Dievaluasi',
        icon: HiOutlineUserGroup,
        accent: 'border-blue-200 bg-blue-50',
        iconColor: 'text-blue-600',
        formatValue: (teacher) => teacher.value,
        suffix: 'respons evaluasi',
    },
];

export default function TeacherHighlights({ insights }) {
    return (
        <div className="grid gap-4 lg:grid-cols-3">
            {cards.map((card) => {
                const teacher = insights[card.key];
                const Icon = card.icon;

                return (
                    <div
                        key={card.key}
                        className={`rounded-xl border p-5 ${card.accent}`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    {card.title}
                                </p>
                                <p className="mt-2 text-lg font-bold text-slate-800">
                                    {teacher?.nama ?? 'Belum ada data'}
                                </p>
                            </div>
                            <Icon className={`h-6 w-6 shrink-0 ${card.iconColor}`} />
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                            {teacher
                                ? `${card.formatValue(teacher)} ${card.suffix}`
                                : 'Data akan tampil setelah evaluasi dikirim.'}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
