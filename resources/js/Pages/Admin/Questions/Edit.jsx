import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ question }) {
    const form = useForm({
        pertanyaan: question.pertanyaan || "",
        urutan: question.urutan || 1,
        is_active: question.is_active ? 1 : 0,
    });

    const submit = (e) => {
        e.preventDefault();
        form.put(route("admin.questions.update", question.id));
    };

    return (
        <AdminLayout title="Edit Pertanyaan">
            <Head title="Edit Pertanyaan" />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel value="Pertanyaan" />
                        <TextInput
                            className="mt-1 w-full"
                            value={form.data.pertanyaan}
                            onChange={(e) =>
                                form.setData("pertanyaan", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <InputLabel value="Urutan" />
                        <TextInput
                            type="number"
                            className="mt-1 w-full"
                            value={form.data.urutan}
                            onChange={(e) =>
                                form.setData("urutan", e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <InputLabel value="Status" />
                        <select
                            className="mt-1 w-full rounded-md border-slate-300"
                            value={form.data.is_active}
                            onChange={(e) =>
                                form.setData("is_active", e.target.value)
                            }
                        >
                            <option value={1}>Aktif</option>
                            <option value={0}>Nonaktif</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <PrimaryButton>Update</PrimaryButton>
                        <Link href={route("admin.questions.index")}>
                            <SecondaryButton type="button">
                                Batal
                            </SecondaryButton>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
