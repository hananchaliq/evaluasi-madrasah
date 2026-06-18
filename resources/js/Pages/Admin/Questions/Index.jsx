import DangerButton from "@/Components/DangerButton";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlinePlus,
    HiOutlineTrash,
} from "react-icons/hi2";

export default function Index({ questions, filters }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const searchForm = useForm({
        search: filters.search || "",
        is_active: filters.is_active ?? "",
    });

    const deleteForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route("admin.questions.index"),
            {
                search: searchForm.data.search || undefined,
                is_active:
                    searchForm.data.is_active !== ""
                        ? searchForm.data.is_active
                        : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetSearch = () => {
        searchForm.setData({
            search: "",
            is_active: "",
        });

        router.get(
            route("admin.questions.index"),
            {},
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const openDelete = (q) => {
        setDeleteTarget(q);
        setShowDeleteModal(true);
    };

    const closeDelete = () => {
        setDeleteTarget(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        deleteForm.delete(route("admin.questions.destroy", deleteTarget.id), {
            onSuccess: closeDelete,
        });
    };

    return (
        <AdminLayout title="Pertanyaan Evaluasi">
            <Head title="Pertanyaan Evaluasi" />

            <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                        Kelola pertanyaan evaluasi pembelajaran siswa.
                    </p>

                    <Link
                        href={route("admin.questions.create")}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        Tambah Pertanyaan
                    </Link>
                </div>

                {/* FILTER */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form
                        onSubmit={handleSearch}
                        className="grid gap-4 sm:grid-cols-2"
                    >
                        <div>
                            <InputLabel value="Cari Pertanyaan" />
                            <div className="relative mt-1">
                                <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <TextInput
                                    className="w-full pl-10"
                                    value={searchForm.data.search}
                                    onChange={(e) =>
                                        searchForm.setData(
                                            "search",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Cari isi pertanyaan..."
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel value="Status" />
                            <select
                                className="mt-1 w-full rounded-md border-slate-300"
                                value={searchForm.data.is_active}
                                onChange={(e) =>
                                    searchForm.setData(
                                        "is_active",
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">Semua</option>
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>

                        <div className="flex gap-2 sm:col-span-2">
                            <PrimaryButton type="submit">Cari</PrimaryButton>
                            <SecondaryButton
                                type="button"
                                onClick={resetSearch}
                            >
                                Reset
                            </SecondaryButton>
                        </div>
                    </form>
                </div>

                {/* TABLE */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                                        Pertanyaan
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-slate-600 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold text-slate-600 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-200 bg-white">
                                {questions.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            Tidak ada data pertanyaan.
                                        </td>
                                    </tr>
                                ) : (
                                    questions.data.map((q, i) => (
                                        <tr
                                            key={q.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {(questions.from ?? 1) + i}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                                {q.pertanyaan}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {q.urutan}
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        q.is_active
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-100 text-slate-600"
                                                    }`}
                                                >
                                                    {q.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-end">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.questions.edit",
                                                            q.id,
                                                        )}
                                                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50"
                                                    >
                                                        <HiOutlinePencilSquare />
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            openDelete(q)
                                                        }
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        <HiOutlineTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 px-6 py-4">
                        <Pagination links={questions.links} />
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <Modal show={showDeleteModal} onClose={closeDelete}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Hapus Pertanyaan
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        Yakin mau hapus data ini?
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDelete}>
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={confirmDelete}>
                            Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
