import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ tingkatans }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        tingkatan_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('kelas.store'));
    };

    return (
        <AdminLayout title="Tambah Kelas">
            <Head title="Tambah Kelas" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Tambahkan kelas baru untuk tingkatan tertentu.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {tingkatans.length === 0 ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            Belum ada data tingkatan. Silakan{' '}
                            <Link
                                href={route('tingkatans.create')}
                                className="font-semibold underline"
                            >
                                tambah tingkatan
                            </Link>{' '}
                            terlebih dahulu.
                        </div>
                    ) : (
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
                                        setData(
                                            'tingkatan_id',
                                            e.target.value,
                                        )
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
                                    onChange={(e) =>
                                        setData('nama', e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    isFocused
                                    placeholder="Contoh: X IPA 1, XI IPS 2"
                                />
                                <InputError
                                    message={errors.nama}
                                    className="mt-2"
                                />
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
                                    Simpan
                                </PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
