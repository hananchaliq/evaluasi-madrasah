import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ semester, academicYears }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: semester.nama,
        academic_year_id: semester.academic_year_id,
        is_active: semester.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('semesters.update', semester.id));
    };

    return (
        <AdminLayout title="Ubah Semester">
            <Head title="Ubah Semester" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui data semester. Mengaktifkan semester ini akan
                        menonaktifkan semester lain.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="academic_year_id"
                                value="Tahun Akademik"
                            />
                            <select
                                id="academic_year_id"
                                value={data.academic_year_id}
                                onChange={(e) =>
                                    setData('academic_year_id', e.target.value)
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
                            <InputLabel htmlFor="nama" value="Nama Semester" />
                            <TextInput
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Contoh: Ganjil, Genap"
                            />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>

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
                                        Jadikan Semester Aktif
                                    </span>
                                    <span className="mt-1 block text-sm text-slate-600">
                                        Hanya satu semester yang boleh aktif
                                        pada satu waktu.
                                    </span>
                                </span>
                            </label>
                            <InputError
                                message={errors.is_active}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route('semesters.index')}>
                                <SecondaryButton type="button">
                                    Batal
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                            >
                                Perbarui
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
