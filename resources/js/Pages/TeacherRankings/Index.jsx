import TeacherRankingFilters from '@/Components/TeacherRankings/TeacherRankingFilters';
import TeacherRankingPodium from '@/Components/TeacherRankings/TeacherRankingPodium';
import TeacherRankingTable from '@/Components/TeacherRankings/TeacherRankingTable';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({
    filters,
    search,
    rankingType,
    context,
    podium,
    rankings,
    rankingTypes,
    academicYears,
    semesters,
    teachers,
    kelasList,
    subjects,
    subjectCategories,
}) {
    const handleRankingTypeChange = (nextRankingType) => {
        router.get(
            route('teacher-rankings.index'),
            {
                ranking_type: nextRankingType,
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
        <AdminLayout title="Peringkat Guru">
            <Head title="Peringkat Guru" />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-slate-600">
                        Lihat peringkat performa guru berdasarkan evaluasi
                        pembelajaran siswa.
                    </p>
                </div>

                <TeacherRankingFilters
                    academicYears={academicYears}
                    semesters={semesters}
                    teachers={teachers}
                    kelasList={kelasList}
                    subjects={subjects}
                    subjectCategories={subjectCategories}
                    filters={filters}
                    search={search}
                    rankingType={rankingType}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <h3 className="text-base font-semibold text-slate-800">
                        Jenis Peringkat
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {context.scope_label}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {rankingTypes.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                    handleRankingTypeChange(option.value)
                                }
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    rankingType === option.value
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {context.warnings?.length > 0 && (
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            <ul className="list-disc space-y-1 ps-5">
                                {context.warnings.map((warning) => (
                                    <li key={warning}>{warning}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <TeacherRankingPodium
                    podium={podium}
                    rankingType={rankingType}
                />

                <TeacherRankingTable
                    rankings={rankings}
                    rankingType={rankingType}
                />
            </div>
        </AdminLayout>
    );
}
