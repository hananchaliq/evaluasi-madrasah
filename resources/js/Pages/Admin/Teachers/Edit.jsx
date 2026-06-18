import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ teacher }) {
    const { data, setData, put, processing, errors } = useForm({
        nama: teacher.nama,
        nip: teacher.nip ?? "",
        email: teacher.user?.email ?? "", // Ambil email dari relasi user objek
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.teachers.update", teacher.id));
    };

    return (
        <AdminLayout title="Ubah Data Guru">
            <Head title="Ubah Data Guru" />

            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui informasi biodata atau email login milik guru.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        {/* NAMA */}
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
                                placeholder="Masukkan nama lengkap guru"
                            />
                            <InputError
                                message={errors.nama}
                                className="mt-2"
                            />
                        </div>

                        {/* NIP */}
                        <div>
                            <InputLabel htmlFor="nip" value="NIP Guru" />
                            <TextInput
                                id="nip"
                                value={data.nip}
                                onChange={(e) => setData("nip", e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Masukkan NIP guru"
                                required
                            />
                            <InputError message={errors.nip} className="mt-2" />
                        </div>

                        {/* EMAIL */}
                        <div>
                            <InputLabel
                                htmlFor="email"
                                value="Email Akun Login"
                            />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Masukkan email aktif"
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
                                Perbarui
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
