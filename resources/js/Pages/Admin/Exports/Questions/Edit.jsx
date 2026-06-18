import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ question }) {
    const { data, setData, put, processing, errors } = useForm({
        pertanyaan: question.pertanyaan,
        urutan: question.urutan,
        is_active: question.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('questions.update', question.id));
    };

    return (
        <AdminLayout title="Ubah Pertanyaan Evaluasi">
            <Head title="Ubah Pertanyaan Evaluasi" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui pertanyaan evaluasi yang sudah ada.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel
                                htmlFor="pertanyaan"
                                value="Pertanyaan Evaluasi"
                            />
                            <textarea
                                id="pertanyaan"
                                value={data.pertanyaan}
                                onChange={(e) =>
                                    setData('pertanyaan', e.target.value)
                                }
                                rows={4}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                autoFocus
                            />
                            <InputError
                                message={errors.pertanyaan}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="urutan" value="Urutan" />
                            <TextInput
                                id="urutan"
                                type="number"
                                min="1"
                                value={data.urutan}
                                onChange={(e) =>
                                    setData('urutan', e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.urutan}
                                className="mt-2"
                            />
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
                                        Pertanyaan Aktif
                                    </span>
                                    <span className="mt-1 block text-sm text-slate-600">
                                        Hanya pertanyaan aktif yang ditampilkan
                                        saat evaluasi berlangsung.
                                    </span>
                                </span>
                            </label>
                            <InputError
                                message={errors.is_active}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route('questions.index')}>
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
