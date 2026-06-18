import Checkbox from '@/Components/Checkbox';
import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    HiOutlineArrowDown,
    HiOutlineArrowUp,
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlinePlus,
    HiOutlineTrash,
} from 'react-icons/hi2';

const evaluationScale = [
    { score: 1, label: 'STS', description: 'Sangat Tidak Setuju' },
    { score: 2, label: 'TS', description: 'Tidak Setuju' },
    { score: 3, label: 'N', description: 'Netral' },
    { score: 4, label: 'S', description: 'Setuju' },
    { score: 5, label: 'SS', description: 'Sangat Setuju' },
];

export default function Index({ questions, filters }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkAction, setBulkAction] = useState(null);

    const searchForm = useForm({
        search: filters.search || '',
        is_active: filters.is_active ?? '',
    });

    const deleteForm = useForm({});
    const bulkForm = useForm({
        action: '',
        ids: [],
    });

    const pageIds = useMemo(
        () => questions.data.map((question) => question.id),
        [questions.data],
    );

    const allPageSelected =
        pageIds.length > 0 &&
        pageIds.every((id) => selectedIds.includes(id));

    const hasActiveFilters = filters.search || filters.is_active !== '';

    const toggleSelectAll = () => {
        if (allPageSelected) {
            setSelectedIds((current) =>
                current.filter((id) => !pageIds.includes(id)),
            );

            return;
        }

        setSelectedIds((current) => [...new Set([...current, ...pageIds])]);
    };

    const toggleSelect = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((itemId) => itemId !== id)
                : [...current, id],
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('admin.questions.index'),
            {
                search: searchForm.data.search || undefined,
                is_active:
                    searchForm.data.is_active !== ''
                        ? searchForm.data.is_active
                        : undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleResetSearch = () => {
        searchForm.setData({
            search: '',
            is_active: '',
        });
        setSelectedIds([]);
        router.get(route('admin.questions.index'), {}, { preserveState: true, replace: true });
    };

    const openDeleteModal = (question) => {
        setDeleteTarget(question);
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

        deleteForm.delete(route('admin.questions.destroy', deleteTarget.id), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds((current) =>
                    current.filter((id) => id !== deleteTarget.id),
                );
                closeDeleteModal();
            },
        });
    };

    const openBulkModal = (action) => {
        setBulkAction(action);
        bulkForm.setData({
            action,
            ids: selectedIds,
        });
        setShowBulkModal(true);
    };

    const closeBulkModal = () => {
        setBulkAction(null);
        setShowBulkModal(false);
        bulkForm.reset();
    };

    const confirmBulkAction = () => {
        bulkForm.patch(route('admin.questions.bulk'), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedIds([]);
                closeBulkModal();
            },
        });
    };

    const moveQuestion = (questionId, direction) => {
        router.patch(
            route('admin.questions.move', questionId),
            {
                direction,
                search: filters.search || undefined,
                is_active:
                    filters.is_active !== '' &&
                    filters.is_active !== undefined
                        ? filters.is_active
                        : undefined,
                page: questions.current_page,
            },
            { preserveScroll: true },
        );
    };

    const bulkActionLabels = {
        activate: 'Aktifkan',
        deactivate: 'Nonaktifkan',
        delete: 'Hapus',
    };

    const truncateText = (text, length = 80) =>
        text.length > length ? `${text.slice(0, length)}...` : text;

    return (
        <AdminLayout title="Pertanyaan Evaluasi">
            <Head title="Pertanyaan Evaluasi" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            Kelola pertanyaan evaluasi pembelajaran, urutan
                            tampilan, dan status aktif.
                        </p>
                    </div>
                    <Link
                        href={route('admin.questions.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        Tambah Pertanyaan
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <h3 className="text-sm font-semibold text-slate-800">
                        Skala Penilaian Evaluasi
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {evaluationScale.map((item) => (
                            <span
                                key={item.score}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                title={item.description}
                            >
                                <span className="font-semibold text-emerald-700">
                                    {item.score}
                                </span>
                                {item.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end"
                    >
                        <div className="sm:col-span-2 lg:col-span-1">
                            <InputLabel htmlFor="search" value="Cari Pertanyaan" />
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
                                    placeholder="Kata kunci pertanyaan..."
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="is_active" value="Status" />
                            <select
                                id="is_active"
                                value={searchForm.data.is_active}
                                onChange={(e) =>
                                    searchForm.setData(
                                        'is_active',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Aktif</option>
                                <option value="0">Tidak Aktif</option>
                            </select>
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

                {selectedIds.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-emerald-800">
                            {selectedIds.length} pertanyaan dipilih
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <SecondaryButton
                                type="button"
                                onClick={() => openBulkModal('activate')}
                            >
                                Aktifkan
                            </SecondaryButton>
                            <SecondaryButton
                                type="button"
                                onClick={() => openBulkModal('deactivate')}
                            >
                                Nonaktifkan
                            </SecondaryButton>
                            <DangerButton
                                type="button"
                                onClick={() => openBulkModal('delete')}
                            >
                                Hapus Terpilih
                            </DangerButton>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-start">
                                        <Checkbox
                                            checked={allPageSelected}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Urutan
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Pertanyaan
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Digunakan
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {questions.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            {hasActiveFilters
                                                ? 'Tidak ada pertanyaan yang sesuai dengan filter.'
                                                : 'Belum ada data pertanyaan evaluasi.'}
                                        </td>
                                    </tr>
                                ) : (
                                    questions.data.map((question) => (
                                        <tr
                                            key={question.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-4">
                                                <Checkbox
                                                    checked={selectedIds.includes(
                                                        question.id,
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(
                                                            question.id,
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-800">
                                                        {question.urutan}
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                moveQuestion(
                                                                    question.id,
                                                                    'up',
                                                                )
                                                            }
                                                            className="rounded border border-slate-200 p-1 text-slate-600 transition hover:bg-slate-100"
                                                            title="Pindah ke atas"
                                                        >
                                                            <HiOutlineArrowUp className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                moveQuestion(
                                                                    question.id,
                                                                    'down',
                                                                )
                                                            }
                                                            className="rounded border border-slate-200 p-1 text-slate-600 transition hover:bg-slate-100"
                                                            title="Pindah ke bawah"
                                                        >
                                                            <HiOutlineArrowDown className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-800">
                                                <p className="max-w-xl font-medium">
                                                    {truncateText(
                                                        question.pertanyaan,
                                                    )}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        question.is_active
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-slate-100 text-slate-600'
                                                    }`}
                                                >
                                                    {question.is_active
                                                        ? 'Aktif'
                                                        : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {question.evaluation_answers_count}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-end text-sm">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'admin.questions.edit',
                                                            question.id,
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
                                                                question,
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

                    {questions.data.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <Pagination links={questions.links} />
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
                        Hapus Pertanyaan
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus pertanyaan berikut?
                        <span className="mt-2 block font-semibold text-slate-800">
                            {deleteTarget?.pertanyaan}
                        </span>
                        {deleteTarget?.evaluation_answers_count > 0 && (
                            <span className="mt-2 block text-red-600">
                                Pertanyaan ini sudah digunakan dalam evaluasi
                                dan tidak dapat dihapus.
                            </span>
                        )}
                        {deleteTarget?.evaluation_answers_count === 0 && (
                            <span className="mt-2 block">
                                Tindakan ini tidak dapat dibatalkan.
                            </span>
                        )}
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeDeleteModal}>
                            Batal
                        </SecondaryButton>
                        <DangerButton
                            onClick={confirmDelete}
                            disabled={
                                deleteForm.processing ||
                                deleteTarget?.evaluation_answers_count > 0
                            }
                        >
                            Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>

            <Modal
                show={showBulkModal}
                onClose={closeBulkModal}
                maxWidth="md"
            >
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800">
                        {bulkActionLabels[bulkAction]} Pertanyaan Terpilih
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Apakah Anda yakin ingin{' '}
                        {bulkAction === 'activate' && 'mengaktifkan'}
                        {bulkAction === 'deactivate' && 'menonaktifkan'}
                        {bulkAction === 'delete' && 'menghapus'}{' '}
                        {selectedIds.length} pertanyaan terpilih?
                        {bulkAction === 'delete' && (
                            <span className="mt-2 block">
                                Pertanyaan yang sudah digunakan dalam evaluasi
                                akan dilewati.
                            </span>
                        )}
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeBulkModal}>
                            Batal
                        </SecondaryButton>
                        {bulkAction === 'delete' ? (
                            <DangerButton
                                onClick={confirmBulkAction}
                                disabled={bulkForm.processing}
                            >
                                Hapus
                            </DangerButton>
                        ) : (
                            <PrimaryButton
                                onClick={confirmBulkAction}
                                disabled={bulkForm.processing}
                                className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                            >
                                {bulkActionLabels[bulkAction]}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
