import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama: "",
        nip: "",
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.teachers.store"));
    };

    return (
        <AdminLayout title="Tambah Guru">
            <Head title="Tambah Guru" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Tambahkan data guru baru. Akun user login otomatis
                        dibuat dengan password default dari NIP.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        {/* NAMA GURU */}
                        <div>
                            <InputLabel htmlFor="nama" value="Nama Guru" />
                            <TextInput
                                id="nama"
                                value={data.nama}
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                className="mt-1 block w-full"
                                isFocused
                                placeholder="Masukkan nama lengkap guru beserta gelar"
                            />
                            <InputError
                                message={errors.nama}
                                className="mt-2"
                            />
                        </div>

                        {/* NIP GURU */}
                        <div>
                            <InputLabel htmlFor="nip" value="NIP Guru" />
                            <TextInput
                                id="nip"
                                type="text"
                                value={data.nip}
                                onChange={(e) => setData("nip", e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Masukkan NIP (Akan menjadi password default)"
                                required
                            />
                            <p className="mt-1 text-xs text-slate-500">
                                NIP wajib diisi karena digunakan sebagai
                                password awal guru.
                            </p>
                            <InputError message={errors.nip} className="mt-2" />
                        </div>

                        {/* EMAIL GURU */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Akun Guru"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="contoh: gurumadrasah@gmail.com"
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-6">
                            <Link href={route("admin.teachers.index")}>
                                <SecondaryButton type="button">
                                    Batal
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton
                                disabled={processing}
                                className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                            >
                                Simpan Data
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
