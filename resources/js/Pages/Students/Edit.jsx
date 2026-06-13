import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatKelasLabel } from '@/utils/kelas';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ student, kelasList }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: student.nama,
        nis: student.nis,
        kelas_id: student.kelas_id ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('students.update', student.id));
    };

    return (
        <AdminLayout title="Ubah Data Siswa">
            <Head title="Ubah Data Siswa" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui data siswa yang sudah ada.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="nis" value="NIS" />
                            <TextInput
                                id="nis"
                                value={data.nis}
                                onChange={(e) => setData('nis', e.target.value)}
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Masukkan Nomor Induk Siswa"
                            />
                            <InputError message={errors.nis} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="nama" value="Nama Siswa" />
                            <TextInput
                                id="nama"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Masukkan nama lengkap siswa"
                            />
                            <InputError message={errors.nama} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="kelas_id"
                                value="Kelas (Opsional)"
                            />
                            <select
                                id="kelas_id"
                                value={data.kelas_id}
                                onChange={(e) =>
                                    setData('kelas_id', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Tanpa kelas</option>
                                {kelasList.map((kelas) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {formatKelasLabel(kelas)}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.kelas_id}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route('students.index')}>
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
