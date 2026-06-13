import StatCard from '@/Components/Dashboard/StatCard';
import { formatNumber, formatScore } from '@/utils/formatters';
import {
    HiOutlineArrowTrendingDown,
    HiOutlineArrowTrendingUp,
    HiOutlineChartBar,
    HiOutlineStar,
    HiOutlineUserGroup,
} from 'react-icons/hi2';

export default function AnalyticsRankings({ rankings }) {
    const sections = [
        {
            key: 'best',
            title: 'Peringkat Tertinggi',
            description: 'Guru dengan rata-rata skor terbaik',
            icon: HiOutlineArrowTrendingUp,
            accent: 'border-emerald-200 bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            key: 'lowest',
            title: 'Peringkat Terendah',
            description: 'Guru dengan rata-rata skor terendah',
            icon: HiOutlineArrowTrendingDown,
            accent: 'border-rose-200 bg-rose-50',
            iconColor: 'text-rose-600',
        },
        {
            key: 'average',
            title: 'Paling Banyak Respons',
            description: 'Guru dengan jumlah evaluasi terbanyak',
            icon: HiOutlineUserGroup,
            accent: 'border-blue-200 bg-blue-50',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-base font-semibold text-slate-800">
                    Peringkat Performa Guru
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                    Ringkasan peringkat guru berdasarkan filter yang dipilih.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                {sections.map((section) => {
                    const items = rankings[section.key] || [];
                    const Icon = section.icon;

                    return (
                        <div
                            key={section.key}
                            className={`rounded-xl border p-5 ${section.accent}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        {section.title}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {section.description}
                                    </p>
                                </div>
                                <Icon
                                    className={`h-6 w-6 shrink-0 ${section.iconColor}`}
                                />
                            </div>

                            {items.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-600">
                                    Belum ada data evaluasi.
                                </p>
                            ) : (
                                <ol className="mt-4 space-y-3">
                                    {items.map((item, index) => (
                                        <li
                                            key={`${section.key}-${item.id}`}
                                            className="flex items-start justify-between gap-3 rounded-lg bg-white/70 px-3 py-2"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-slate-500">
                                                    #{index + 1}
                                                </p>
                                                <p className="truncate text-sm font-medium text-slate-800">
                                                    {item.label}
                                                </p>
                                            </div>
                                            <div className="text-end text-sm">
                                                <p className="font-semibold text-slate-800">
                                                    {section.key === 'average'
                                                        ? formatNumber(
                                                              item.total_responses,
                                                          )
                                                        : formatScore(
                                                              item.average_score,
                                                          )}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {section.key === 'average'
                                                        ? 'respons'
                                                        : 'rata-rata'}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function AnalyticsSummaryCards({ summary }) {
    const cards = [
        {
            label: 'Rata-rata Skor',
            value: formatScore(summary.average_score),
            description: 'Rata-rata skor evaluasi pada filter aktif',
            icon: HiOutlineStar,
            accent: 'violet',
        },
        {
            label: 'Skor Tertinggi',
            value: formatScore(summary.highest_score),
            description: 'Skor evaluasi tertinggi yang tercatat',
            icon: HiOutlineArrowTrendingUp,
            accent: 'emerald',
        },
        {
            label: 'Skor Terendah',
            value: formatScore(summary.lowest_score),
            description: 'Skor evaluasi terendah yang tercatat',
            icon: HiOutlineArrowTrendingDown,
            accent: 'rose',
        },
        {
            label: 'Total Respons',
            value: formatNumber(summary.total_responses),
            description: 'Jumlah evaluasi yang sudah dikirim',
            icon: HiOutlineChartBar,
            accent: 'blue',
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
