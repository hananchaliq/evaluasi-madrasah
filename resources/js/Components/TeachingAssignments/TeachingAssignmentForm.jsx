import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { formatKelasLabel } from '@/utils/kelas';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

export default function TeachingAssignmentForm({
    data,
    setData,
    errors,
    processing,
    teachers,
    subjects,
    kelasList,
    academicYears,
    semesters,
    submitLabel,
    cancelHref,
    onSubmit,
}) {
    const filteredSemesters = useMemo(() => {
        if (!data.academic_year_id) {
            return [];
        }

        return semesters.filter(
            (semester) =>
                String(semester.academic_year_id) ===
                String(data.academic_year_id),
        );
    }, [data.academic_year_id, semesters]);

    const handleAcademicYearChange = (value) => {
        setData({
            ...data,
            academic_year_id: value,
            semester_id: '',
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="teacher_id" value="Guru" />
                    <select
                        id="teacher_id"
                        value={data.teacher_id}
                        onChange={(e) =>
                            setData('teacher_id', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Pilih guru</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.nama}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.teacher_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="subject_id" value="Mata Pelajaran" />
                    <select
                        id="subject_id"
                        value={data.subject_id}
                        onChange={(e) =>
                            setData('subject_id', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Pilih mata pelajaran</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.nama}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.subject_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="kelas_id" value="Kelas" />
                    <select
                        id="kelas_id"
                        value={data.kelas_id}
                        onChange={(e) => setData('kelas_id', e.target.value)}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Pilih kelas</option>
                        {kelasList.map((kelas) => (
                            <option key={kelas.id} value={kelas.id}>
                                {formatKelasLabel(kelas)}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.kelas_id} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="academic_year_id"
                        value="Tahun Akademik"
                    />
                    <select
                        id="academic_year_id"
                        value={data.academic_year_id}
                        onChange={(e) =>
                            handleAcademicYearChange(e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                    >
                        <option value="">Pilih tahun akademik</option>
                        {academicYears.map((year) => (
                            <option key={year.id} value={year.id}>
                                {year.nama}
                            </option>
                        ))}
                    </select>
                    <InputError
                        message={errors.academic_year_id}
                        className="mt-2"
                    />
                </div>

                <div className="sm:col-span-2">
                    <InputLabel htmlFor="semester_id" value="Semester" />
                    <select
                        id="semester_id"
                        value={data.semester_id}
                        onChange={(e) =>
                            setData('semester_id', e.target.value)
                        }
                        disabled={!data.academic_year_id}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">
                            {data.academic_year_id
                                ? 'Pilih semester'
                                : 'Pilih tahun akademik terlebih dahulu'}
                        </option>
                        {filteredSemesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.nama}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.semester_id} className="mt-2" />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                <Link href={cancelHref}>
                    <SecondaryButton type="button">Batal</SecondaryButton>
                </Link>
                <PrimaryButton
                    disabled={processing}
                    className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                >
                    {submitLabel}
                </PrimaryButton>
            </div>
        </form>
    );
}
