import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ tingkatan }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: tingkatan.nama,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('tingkatans.update', tingkatan.id));
    };

    return (
        <AdminLayout title="Ubah Tingkatan">
            <Head title="Ubah Tingkatan" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui data tingkatan yang sudah ada.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Tingkatan" />
                            <TextInput
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Contoh: X, XI, XII"
                            />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route('tingkatans.index')}>
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
