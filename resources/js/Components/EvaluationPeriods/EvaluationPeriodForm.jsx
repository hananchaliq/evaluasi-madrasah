import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

export default function EvaluationPeriodForm({
    data,
    setData,
    errors,
    processing,
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
            <div>
                <InputLabel htmlFor="nama" value="Nama Periode Evaluasi" />
                <TextInput
                    id="nama"
                    value={data.nama}
                    onChange={(e) => setData('nama', e.target.value)}
                    className="mt-1 block w-full"
                    isFocused
                    placeholder="Contoh: Evaluasi Semester Ganjil 2025/2026"
                />
                <InputError message={errors.nama} className="mt-2" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
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

                <div>
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

                <div>
                    <InputLabel htmlFor="start_date" value="Tanggal Mulai" />
                    <TextInput
                        id="start_date"
                        type="date"
                        value={data.start_date}
                        onChange={(e) =>
                            setData('start_date', e.target.value)
                        }
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.start_date} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="end_date" value="Tanggal Selesai" />
                    <TextInput
                        id="end_date"
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData('end_date', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    <InputError message={errors.end_date} className="mt-2" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="flex items-start gap-3">
                        <Checkbox
                            name="is_active"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="mt-1"
                        />
                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                Periode Evaluasi Aktif
                            </span>
                            <span className="mt-1 block text-sm text-slate-600">
                                Hanya satu periode evaluasi yang boleh aktif
                                pada satu waktu.
                            </span>
                        </span>
                    </label>
                    <InputError message={errors.is_active} className="mt-2" />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="flex items-start gap-3">
                        <Checkbox
                            name="is_locked"
                            checked={data.is_locked}
                            onChange={(e) =>
                                setData('is_locked', e.target.checked)
                            }
                            className="mt-1"
                        />
                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                Kunci Periode
                            </span>
                            <span className="mt-1 block text-sm text-slate-600">
                                Periode terkunci tidak dapat menerima pengisian
                                evaluasi baru.
                            </span>
                        </span>
                    </label>
                    <InputError message={errors.is_locked} className="mt-2" />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="flex items-start gap-3">
                        <Checkbox
                            name="is_anonymous"
                            checked={data.is_anonymous}
                            onChange={(e) =>
                                setData('is_anonymous', e.target.checked)
                            }
                            className="mt-1"
                        />
                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                Evaluasi Anonim
                            </span>
                            <span className="mt-1 block text-sm text-slate-600">
                                Identitas siswa tidak ditampilkan dalam laporan
                                evaluasi guru.
                            </span>
                        </span>
                    </label>
                    <InputError
                        message={errors.is_anonymous}
                        className="mt-2"
                    />
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
