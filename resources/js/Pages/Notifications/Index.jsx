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
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineInformationCircle,
    HiOutlineMagnifyingGlass,
    HiOutlineTrash,
} from 'react-icons/hi2';

const severityStyles = {
    info: {
        badge: 'bg-blue-100 text-blue-700',
        icon: HiOutlineInformationCircle,
    },
    warning: {
        badge: 'bg-amber-100 text-amber-700',
        icon: HiOutlineExclamationTriangle,
    },
    success: {
        badge: 'bg-emerald-100 text-emerald-700',
        icon: HiOutlineCheckCircle,
    },
};

export default function Index({ notifications, filters, summary, typeOptions }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const searchForm = useForm({
        search: filters.search || '',
        type: filters.type || '',
        is_read: filters.is_read ?? '',
    });

    const deleteForm = useForm({});
    const markAllForm = useForm({});

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('notifications.index'),
            {
                search: searchForm.data.search || undefined,
                type: searchForm.data.type || undefined,
                is_read:
                    searchForm.data.is_read !== ''
                        ? searchForm.data.is_read
                        : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleResetSearch = () => {
        searchForm.setData({
            search: '',
            type: '',
            is_read: '',
        });
        router.get(route('notifications.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    const markAsRead = (notificationId) => {
        router.patch(route('notifications.read', notificationId), {}, {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        markAllForm.patch(route('notifications.read-all'), {
            preserveScroll: true,
        });
    };

    const openDeleteModal = (notification) => {
        setDeleteTarget(notification);
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

        deleteForm.delete(route('notifications.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => closeDeleteModal(),
        });
    };

    return (
        <AdminLayout title="Notifikasi">
            <Head title="Notifikasi" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            Kelola pemberitahuan sistem evaluasi pembelajaran.
                        </p>
                    </div>
                    <SecondaryButton
                        type="button"
                        onClick={markAllAsRead}
                        disabled={markAllForm.processing || summary.unread === 0}
                    >
                        Tandai Semua Dibaca
                    </SecondaryButton>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Total</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                            {summary.total}
                        </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                        <p className="text-sm text-emerald-700">Belum Dibaca</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-800">
                            {summary.unread}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Sudah Dibaca</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                            {summary.read}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
                    >
                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="search" value="Cari Notifikasi" />
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
                                    placeholder="Judul atau isi notifikasi..."
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="type" value="Jenis" />
                            <select
                                id="type"
                                value={searchForm.data.type}
                                onChange={(e) =>
                                    searchForm.setData('type', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Jenis</option>
                                {typeOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="is_read" value="Status Baca" />
                            <select
                                id="is_read"
                                value={searchForm.data.is_read}
                                onChange={(e) =>
                                    searchForm.setData(
                                        'is_read',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="0">Belum Dibaca</option>
                                <option value="1">Sudah Dibaca</option>
                            </select>
                        </div>

                        <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
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
                                        Notifikasi
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Jenis
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Waktu
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {notifications.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            <HiOutlineBell className="mx-auto h-8 w-8 text-slate-300" />
                                            <span className="mt-2 block">
                                                Tidak ada notifikasi yang
                                                sesuai filter.
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    notifications.data.map((notification) => {
                                        const style =
                                            severityStyles[
                                                notification.severity
                                            ] ?? severityStyles.info;
                                        const Icon = style.icon;

                                        return (
                                            <tr
                                                key={notification.id}
                                                className={`hover:bg-slate-50 ${!notification.is_read ? 'bg-emerald-50/40' : ''}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">
                                                                {
                                                                    notification.title
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-600">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    {notification.type_label}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    {new Date(
                                                        notification.created_at,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                                                    >
                                                        {notification.is_read
                                                            ? 'Sudah Dibaca'
                                                            : 'Belum Dibaca'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-end text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {!notification.is_read && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.id,
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                                                            >
                                                                <HiOutlineCheckCircle className="h-4 w-4" />
                                                                Dibaca
                                                            </button>
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    notification,
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
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {notifications.data.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <Pagination links={notifications.links} />
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
                        Hapus Notifikasi
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus notifikasi{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.title}
                        </span>
                        ?
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
