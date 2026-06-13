import { formatNumber, formatScore } from '@/utils/formatters';
import { HiOutlineTrophy } from 'react-icons/hi2';

const podiumStyles = [
    {
        rank: 1,
        wrapper: 'order-2 sm:order-2',
        card: 'border-amber-300 bg-amber-50',
        badge: 'bg-amber-500 text-white',
        label: 'Juara 1',
    },
    {
        rank: 2,
        wrapper: 'order-1 sm:order-1',
        card: 'border-slate-300 bg-slate-50',
        badge: 'bg-slate-500 text-white',
        label: 'Juara 2',
    },
    {
        rank: 3,
        wrapper: 'order-3 sm:order-3',
        card: 'border-orange-300 bg-orange-50',
        badge: 'bg-orange-600 text-white',
        label: 'Juara 3',
    },
];

export default function TeacherRankingPodium({ podium, rankingType }) {
    if (podium.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
                Belum ada data peringkat guru untuk filter ini.
            </div>
        );
    }

    const showPodium = rankingType !== 'lowest';

    if (!showPodium) {
        return null;
    }

    const slots = podiumStyles.map((style, index) => ({
        ...style,
        teacher: podium[index] ?? null,
    }));

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
                <HiOutlineTrophy className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-semibold text-slate-800">
                    Podium Tiga Teratas
                </h3>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3 sm:items-end">
                {slots.map((slot) => (
                    <div
                        key={slot.rank}
                        className={`flex flex-col items-center ${slot.wrapper}`}
                    >
                        {slot.teacher ? (
                            <div
                                className={`w-full rounded-xl border p-5 text-center ${slot.card} ${
                                    slot.rank === 1 ? 'sm:-translate-y-2' : ''
                                }`}
                            >
                                <span
                                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${slot.badge}`}
                                >
                                    {slot.rank}
                                </span>
                                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {slot.label}
                                </p>
                                <p className="mt-2 text-base font-bold text-slate-800">
                                    {slot.teacher.teacher_name}
                                </p>
                                <p className="mt-2 text-2xl font-bold text-emerald-700">
                                    {formatScore(slot.teacher.average_score)}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {formatNumber(slot.teacher.total_responses)}{' '}
                                    respons
                                </p>
                            </div>
                        ) : (
                            <div className="w-full rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-400">
                                —
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
