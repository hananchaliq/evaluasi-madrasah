import AnalyticsFilters from '@/Components/Analytics/AnalyticsFilters';
import AnalyticsRankings, {
    AnalyticsSummaryCards,
} from '@/Components/Analytics/AnalyticsRankings';
import AnalyticsStatisticsTable, {
    groupByLabels,
} from '@/Components/Analytics/AnalyticsStatisticsTable';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

const groupByOptions = [
    { value: 'teacher', label: 'Guru' },
    { value: 'class', label: 'Kelas' },
    { value: 'subject', label: 'Mata Pelajaran' },
    { value: 'category', label: 'Kategori Mapel' },
    { value: 'academic_year', label: 'Tahun Akademik' },
    { value: 'semester', label: 'Semester' },
];

export default function Index({
    filters,
    search,
    groupBy,
    summary,
    statistics,
    rankings,
    academicYears,
    semesters,
    teachers,
    kelasList,
    subjects,
    subjectCategories,
}) {
    const handleGroupChange = (nextGroupBy) => {
        router.get(
            route('analytics.index'),
            {
                group_by: nextGroupBy,
                search: search || undefined,
                academic_year_id: filters.academic_year_id || undefined,
                semester_id: filters.semester_id || undefined,
                teacher_id: filters.teacher_id || undefined,
                kelas_id: filters.kelas_id || undefined,
                subject_id: filters.subject_id || undefined,
                subject_category_id:
                    filters.subject_category_id || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Analitik Evaluasi">
            <Head title="Analitik Evaluasi" />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-slate-600">
                        Analisis statistik evaluasi pembelajaran per guru,
                        kelas, mata pelajaran, kategori, tahun akademik, dan
                        semester.
                    </p>
                </div>

                <AnalyticsFilters
                    academicYears={academicYears}
                    semesters={semesters}
                    teachers={teachers}
                    kelasList={kelasList}
                    subjects={subjects}
                    subjectCategories={subjectCategories}
                    filters={filters}
                    search={search}
                    groupBy={groupBy}
                />

                <AnalyticsSummaryCards summary={summary} />

                <AnalyticsRankings rankings={rankings} />

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <h3 className="text-base font-semibold text-slate-800">
                        Tampilan Statistik
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Pilih dimensi untuk melihat rincian statistik evaluasi.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {groupByOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleGroupChange(option.value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    groupBy === option.value
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <p className="mt-3 text-xs text-slate-500">
                        Dimensi aktif:{' '}
                        <span className="font-semibold text-slate-700">
                            {groupByLabels[groupBy]}
                        </span>
                    </p>
                </div>

                <AnalyticsStatisticsTable
                    statistics={statistics}
                    groupBy={groupBy}
                />
            </div>
        </AdminLayout>
    );
}
