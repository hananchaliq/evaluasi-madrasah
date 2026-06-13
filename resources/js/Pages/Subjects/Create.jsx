import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ subjectCategories }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        subject_category_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('subjects.store'));
    };

    return (
        <AdminLayout title="Tambah Mata Pelajaran">
            <Head title="Tambah Mata Pelajaran" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Tambahkan mata pelajaran baru ke dalam kategori yang
                        sesuai.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {subjectCategories.length === 0 ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            Belum ada kategori mata pelajaran. Silakan{' '}
                            <Link
                                href={route('subject-categories.create')}
                                className="font-semibold underline"
                            >
                                tambah kategori
                            </Link>{' '}
                            terlebih dahulu.
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel
                                    htmlFor="subject_category_id"
                                    value="Kategori Mata Pelajaran"
                                />
                                <select
                                    id="subject_category_id"
                                    value={data.subject_category_id}
                                    onChange={(e) =>
                                        setData(
                                            'subject_category_id',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">
                                        Pilih kategori mata pelajaran
                                    </option>
                                    {subjectCategories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.nama}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.subject_category_id}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="nama"
                                    value="Nama Mata Pelajaran"
                                />
                                <TextInput
                                    id="nama"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData('nama', e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    isFocused
                                    placeholder="Contoh: Matematika, Bahasa Indonesia"
                                />
                                <InputError
                                    message={errors.nama}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                                <Link href={route('subjects.index')}>
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
