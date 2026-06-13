import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ academicYear }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: academicYear.nama,
        is_active: academicYear.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('academic-years.update', academicYear.id));
    };

    return (
        <AdminLayout title="Ubah Tahun Akademik">
            <Head title="Ubah Tahun Akademik" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui data tahun akademik. Mengaktifkan tahun ini
                        akan menonaktifkan tahun akademik lain.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="nama"
                                value="Nama Tahun Akademik"
                            />
                            <TextInput
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Contoh: 2025/2026"
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
                                        Jadikan Tahun Akademik Aktif
                                    </span>
                                    <span className="mt-1 block text-sm text-slate-600">
                                        Hanya satu tahun akademik yang boleh
                                        aktif pada satu waktu.
                                    </span>
                                </span>
                            </label>
                            <InputError
                                message={errors.is_active}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route('academic-years.index')}>
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
