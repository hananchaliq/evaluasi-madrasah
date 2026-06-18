import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const form = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "student",
    });

    const submit = (e) => {
        e.preventDefault();

        form.post(route("register"), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-800">
                        Register
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Buat akun baru sistem
                    </p>

                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <label className="text-sm text-slate-600">
                                Nama
                            </label>
                            <input
                                className="mt-1 w-full rounded-md border-slate-300"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData("name", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">
                                Email
                            </label>
                            <input
                                type="email"
                                className="mt-1 w-full rounded-md border-slate-300"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData("email", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">
                                Role
                            </label>
                            <select
                                className="mt-1 w-full rounded-md border-slate-300"
                                value={form.data.role}
                                onChange={(e) =>
                                    form.setData("role", e.target.value)
                                }
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">
                                Password
                            </label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-md border-slate-300"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData("password", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="mt-1 w-full rounded-md border-slate-300"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={form.processing}
                            className="w-full rounded-lg bg-emerald-600 py-2 text-white font-semibold hover:bg-emerald-700"
                        >
                            Register
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 mt-4 text-center">
                        Sudah punya akun?{" "}
                        <Link
                            className="text-emerald-600"
                            href={route("login")}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
