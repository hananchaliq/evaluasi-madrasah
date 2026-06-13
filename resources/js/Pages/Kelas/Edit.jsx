import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ kelasItem, tingkatans }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: kelasItem.nama,
        tingkatan_id: kelasItem.tingkatan_id,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('kelas.update', kelasItem.id));
    };

    return (
        <AdminLayout title="Ubah Kelas">
            <Head title="Ubah Kelas" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui data kelas yang sudah ada.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="tingkatan_id"
                                value="Tingkatan"
                            />
                            <select
                                id="tingkatan_id"
                                value={data.tingkatan_id}
                                onChange={(e) =>
                                    setData('tingkatan_id', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Pilih tingkatan</option>
                                {tingkatans.map((tingkatan) => (
                                    <option
                                        key={tingkatan.id}
                                        value={tingkatan.id}
                                    >
                                        {tingkatan.nama}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.tingkatan_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="nama" value="Nama Kelas" />
                            <TextInput
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Contoh: X IPA 1, XI IPS 2"
                            />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route('kelas.index')}>
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
