import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { formatKelasLabel } from '@/utils/kelas';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

export default function TeacherRankingFilters({
    academicYears,
    semesters,
    teachers,
    kelasList,
    subjects,
    subjectCategories,
    filters,
    search,
    rankingType,
}) {
    const filteredSemesters = useMemo(() => {
        if (!filters.academic_year_id) {
            return semesters;
        }

        return semesters.filter(
            (semester) =>
                String(semester.academic_year_id) ===
                String(filters.academic_year_id),
        );
    }, [filters.academic_year_id, semesters]);

    const [formState, setFormState] = useState({
        search: search || '',
        academic_year_id: filters.academic_year_id || '',
        semester_id: filters.semester_id || '',
        teacher_id: filters.teacher_id || '',
        kelas_id: filters.kelas_id || '',
        subject_id: filters.subject_id || '',
        subject_category_id: filters.subject_category_id || '',
    });

    const buildQueryParams = (overrides = {}) => {
        const state = { ...formState, ...overrides };

        return {
            ranking_type: rankingType || undefined,
            search: state.search || undefined,
            academic_year_id: state.academic_year_id || undefined,
            semester_id: state.semester_id || undefined,
            teacher_id: state.teacher_id || undefined,
            kelas_id: state.kelas_id || undefined,
            subject_id: state.subject_id || undefined,
            subject_category_id: state.subject_category_id || undefined,
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.get(route('teacher-rankings.index'), buildQueryParams(), {
            preserveState: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setFormState({
            search: '',
            academic_year_id: '',
            semester_id: '',
            teacher_id: '',
            kelas_id: '',
            subject_id: '',
            subject_category_id: '',
        });

        router.get(
            route('teacher-rankings.index'),
            { ranking_type: rankingType || undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleAcademicYearChange = (value) => {
        setFormState((current) => ({
            ...current,
            academic_year_id: value,
            semester_id: '',
        }));
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="text-base font-semibold text-slate-800">
                Filter Peringkat
            </h3>
            <p className="mt-1 text-sm text-slate-500">
                Saring peringkat guru berdasarkan dimensi evaluasi.
            </p>

            <form
                onSubmit={handleSubmit}
                className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
                <div className="sm:col-span-2 lg:col-span-3">
                    <InputLabel htmlFor="search" value="Cari Guru" />
                    <div className="relative mt-1">
                        <HiOutlineMagnifyingGlass className="pointer-events-none absolute inset-s-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <TextInput
                            id="search"
                            value={formState.search}
                            onChange={(e) =>
                                setFormState((current) => ({
                                    ...current,
                                    search: e.target.value,
                                }))
                            }
                            className="block w-full ps-10"
                            placeholder="Nama guru..."
                        />
                    </div>
                </div>

                <div>
                    <InputLabel
                        htmlFor="academic_year_id"
                        value="Tahun Akademik"
                    />
                    <select
                        id="academic_year_id"
                        value={formState.academic_year_id}
                        onChange={(e) =>
                            handleAcademicYearChange(e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Semua Tahun</option>
                        {academicYears.map((year) => (
                            <option key={year.id} value={year.id}>
                                {year.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="semester_id" value="Semester" />
                    <select
                        id="semester_id"
                        value={formState.semester_id}
                        onChange={(e) =>
                            setFormState((current) => ({
                                ...current,
                                semester_id: e.target.value,
                            }))
                        }
                        disabled={!formState.academic_year_id}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">Semua Semester</option>
                        {filteredSemesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="teacher_id" value="Guru" />
                    <select
                        id="teacher_id"
                        value={formState.teacher_id}
                        onChange={(e) =>
                            setFormState((current) => ({
                                ...current,
                                teacher_id: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Semua Guru</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="kelas_id" value="Kelas" />
                    <select
                        id="kelas_id"
                        value={formState.kelas_id}
                        onChange={(e) =>
                            setFormState((current) => ({
                                ...current,
                                kelas_id: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Semua Kelas</option>
                        {kelasList.map((kelas) => (
                            <option key={kelas.id} value={kelas.id}>
                                {formatKelasLabel(kelas)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel htmlFor="subject_id" value="Mata Pelajaran" />
                    <select
                        id="subject_id"
                        value={formState.subject_id}
                        onChange={(e) =>
                            setFormState((current) => ({
                                ...current,
                                subject_id: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Semua Mapel</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <InputLabel
                        htmlFor="subject_category_id"
                        value="Kategori Mapel"
                    />
                    <select
                        id="subject_category_id"
                        value={formState.subject_category_id}
                        onChange={(e) =>
                            setFormState((current) => ({
                                ...current,
                                subject_category_id: e.target.value,
                            }))
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Semua Kategori</option>
                        {subjectCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.nama}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                    <PrimaryButton
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                    >
                        Terapkan Filter
                    </PrimaryButton>
                    <SecondaryButton type="button" onClick={handleReset}>
                        Reset
                    </SecondaryButton>
                </div>
            </form>
        </div>
    );
}
