import InputLabel from '@/Components/InputLabel';
import { router } from '@inertiajs/react';

export default function DashboardFilters({
    academicYears,
    semesters,
    filters,
}) {
    const handleAcademicYearChange = (event) => {
        router.get(
            route('dashboard'),
            {
                academic_year_id: event.target.value || undefined,
                semester_id: undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSemesterChange = (event) => {
        router.get(
            route('dashboard'),
            {
                academic_year_id: filters.academic_year_id || undefined,
                semester_id: event.target.value || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="text-base font-semibold text-slate-800">
                Filter Akademik
            </h3>
            <p className="mt-1 text-sm text-slate-500">
                Statistik evaluasi berdasarkan tahun akademik dan semester.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="academic_year_id" value="Tahun Akademik" />
                    <select
                        id="academic_year_id"
                        value={filters.academic_year_id ?? ''}
                        onChange={handleAcademicYearChange}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Semua Tahun Akademik</option>
                        {academicYears.map((year) => (
                            <option key={year.id} value={year.id}>
                                {year.nama}
                                {year.is_active ? ' (Aktif)' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="semester_id" value="Semester" />
                    <select
                        id="semester_id"
                        value={filters.semester_id ?? ''}
                        onChange={handleSemesterChange}
                        disabled={!filters.academic_year_id}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">Semua Semester</option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.nama}
                                {semester.is_active ? ' (Aktif)' : ''}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
