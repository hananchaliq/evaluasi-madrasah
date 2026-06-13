import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlinePlus,
    HiOutlineTrash,
} from 'react-icons/hi2';

export default function Index({ tingkatans, filters }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const searchForm = useForm({
        search: filters.search || '',
    });

    const deleteForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('tingkatans.index'),
            { search: searchForm.data.search },
            { preserveState: true, replace: true },
        );
    };

    const handleResetSearch = () => {
        searchForm.setData('search', '');
        router.get(route('tingkatans.index'), {}, { preserveState: true, replace: true });
    };

    const openDeleteModal = (tingkatan) => {
        setDeleteTarget(tingkatan);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setDeleteTarget(null);
        setShowDeleteModal(false);
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        deleteForm.delete(route('tingkatans.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
        });
    };

    return (
        <AdminLayout title="Tingkatan">
            <Head title="Tingkatan" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            Kelola data tingkatan madrasah.
                        </p>
                    </div>
                    <Link
                        href={route('tingkatans.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        Tambah Tingkatan
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    >
                        <div className="flex-1">
                            <InputLabel
                                htmlFor="search"
                                value="Cari Tingkatan"
                            />
                            <div className="relative mt-1">
                                <HiOutlineMagnifyingGlass className="pointer-events-none absolute inset-s-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <TextInput
                                    id="search"
                                    value={searchForm.data.search}
                                    onChange={(e) =>
                                        searchForm.setData(
                                            'search',
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full ps-10"
                                    placeholder="Masukkan nama tingkatan..."
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <PrimaryButton
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                            >
                                Cari
                            </PrimaryButton>
                            <SecondaryButton
                                type="button"
                                onClick={handleResetSearch}
                            >
                                Reset
                            </SecondaryButton>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Nama Tingkatan
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Dibuat
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {tingkatans.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            {filters.search
                                                ? 'Tidak ada tingkatan yang sesuai dengan pencarian.'
                                                : 'Belum ada data tingkatan.'}
                                        </td>
                                    </tr>
                                ) : (
                                    tingkatans.data.map((tingkatan, index) => (
                                        <tr
                                            key={tingkatan.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {(tingkatans.from ?? 1) + index}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                                                {tingkatan.nama}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {new Date(
                                                    tingkatan.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-end text-sm">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'tingkatans.edit',
                                                            tingkatan.id,
                                                        )}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        <HiOutlinePencilSquare className="h-4 w-4" />
                                                        Ubah
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                tingkatan,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <HiOutlineTrash className="h-4 w-4" />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {tingkatans.data.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <Pagination links={tingkatans.links} />
                        </div>
                    )}
                </div>
            </div>

            <Modal
                show={showDeleteModal}
                onClose={closeDeleteModal}
                maxWidth="md"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800">
                        Hapus Tingkatan
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus tingkatan{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.nama}
                        </span>
                        ? Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDeleteModal}>
                            Batal
                        </SecondaryButton>
                        <DangerButton
                            onClick={confirmDelete}
                            disabled={deleteForm.processing}
                        >
                            Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
