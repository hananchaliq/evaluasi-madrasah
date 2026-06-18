import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        role: "student", // Default value sesuai struktur tabel users
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Lengkap"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Tambahan Dropdown Role Sesuai Struktur Tabel */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="role"
                        value="Daftar Sebagai"
                        className="text-gray-700 font-medium"
                    />
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition duration-150 ease-in-out"
                        onChange={(e) => setData("role", e.target.value)}
                        required
                    >
                        <option value="student">Siswa (Student)</option>
                        <option value="teacher">Guru (Teacher)</option>
                    </select>
                    <InputError message={errors.role} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        href={route("login")}
                        className="rounded-md text-sm text-gray-500 underline hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                        Sudah punya akun?
                    </Link>

                    <PrimaryButton
                        className="ms-4 bg-emerald-600 hover:bg-emerald-500 text-white focus:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500"
                        disabled={processing}
                    >
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
