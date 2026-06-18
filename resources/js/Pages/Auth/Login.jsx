import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    // State form disederhanakan langsung menargetkan field email
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        role: "student",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    // Helper untuk mengubah label teks berdasarkan role yang aktif
    const getEmailLabel = () => {
        if (data.role === "student") return "Email Siswa";
        if (data.role === "teacher") return "Email Guru";
        return "Email Admin";
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    {status}
                </div>
            )}

            {/* PILIHAN TAB BUTTON ROLE */}
            <div className="mb-6 p-1 bg-gray-100 rounded-xl flex gap-1 border border-gray-200">
                <button
                    type="button"
                    onClick={() => {
                        setData((prev) => ({
                            ...prev,
                            role: "student",
                            email: "",
                        }));
                    }}
                    className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        data.role === "student"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                >
                    Siswa
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setData((prev) => ({
                            ...prev,
                            role: "teacher",
                            email: "",
                        }));
                    }}
                    className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        data.role === "teacher"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                >
                    Guru
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setData((prev) => ({
                            ...prev,
                            role: "admin",
                            email: "",
                        }));
                    }}
                    className={`flex-1 py-2 px-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                        data.role === "admin"
                            ? "bg-emerald-600 text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                >
                    Admin
                </button>
            </div>

            <form onSubmit={submit}>
                {/* INPUT EMAIL */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value={getEmailLabel()}
                        className="text-gray-700 font-medium"
                    />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder={`Masukkan ${getEmailLabel().toLowerCase()}`}
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* INPUT PASSWORD */}
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="text-gray-700 font-medium"
                        />
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* REMEMBER ME */}
                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Ingat saya di perangkat ini
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-gray-500 underline hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                            Lupa password?
                        </Link>
                    )}

                    <PrimaryButton
                        className="ms-4 bg-emerald-600 hover:bg-emerald-500 text-white focus:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500"
                        disabled={processing}
                    >
                        Masuk Sistem
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
