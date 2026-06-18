import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Import({ type }) {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.imports.store", type), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Import">
            <Head title="Import" />

            <div className="max-w-xl space-y-4">
                <h1 className="text-lg font-semibold">Import {type}</h1>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="file"
                        onChange={(e) => setData("file", e.target.files[0])}
                        className="block w-full"
                    />

                    {errors.file && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                            {Array.isArray(errors.file)
                                ? errors.file.map((err, i) => (
                                      <div key={i}>• {err}</div>
                                  ))
                                : errors.file}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
                    >
                        Upload & Import
                    </button>

                    <a
                        href={route("admin.imports.template", type)}
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700"
                    >
                        Download Template
                    </a>
                </form>
            </div>
        </AdminLayout>
    );
}
