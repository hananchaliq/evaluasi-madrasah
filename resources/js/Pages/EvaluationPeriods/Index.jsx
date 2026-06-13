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
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlinePlus,
    HiOutlineTrash,
} from 'react-icons/hi2';

const formatDate = (value) => {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export default function Index({
    evaluationPeriods,
    academicYears,
    semesters,
    filters,
}) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const searchForm = useForm({
        search: filters.search || '',
        academic_year_id: filters.academic_year_id || '',
        semester_id: filters.semester_id || '',
        is_active: filters.is_active ?? '',
    });

    const deleteForm = useForm({});

    const filteredSemesters = useMemo(() => {
        if (!searchForm.data.academic_year_id) {
            return semesters;
        }

        return semesters.filter(
            (semester) =>
                String(semester.academic_year_id) ===
                String(searchForm.data.academic_year_id),
        );
    }, [searchForm.data.academic_year_id, semesters]);

    const hasActiveFilters =
        filters.search ||
        filters.academic_year_id ||
        filters.semester_id ||
        filters.is_active !== '';

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('evaluation-periods.index'),
            {
                search: searchForm.data.search || undefined,
                academic_year_id:
                    searchForm.data.academic_year_id || undefined,
                semester_id: searchForm.data.semester_id || undefined,
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
            academic_year_id: '',
            semester_id: '',
            is_active: '',
        });
        router.get(
            route('evaluation-periods.index'),
            {},
            { preserveState: true, replace: true },
        );
    };

    const handleAcademicYearFilterChange = (value) => {
        searchForm.setData({
            ...searchForm.data,
            academic_year_id: value,
            semester_id: '',
        });
    };

    const openDeleteModal = (period) => {
        setDeleteTarget(period);
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

        deleteForm.delete(
            route('evaluation-periods.destroy', deleteTarget.id),
            {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
            },
        );
    };

    return (
        <AdminLayout title="Periode Evaluasi">
            <Head title="Periode Evaluasi" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            Kelola periode evaluasi pembelajaran berdasarkan
                            tahun akademik dan semester. Hanya satu periode
                            yang dapat aktif pada satu waktu.
                        </p>
                    </div>
                    <Link
                        href={route('evaluation-periods.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        Tambah Periode
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:items-end"
                    >
                        <div className="sm:col-span-2 xl:col-span-2">
                            <InputLabel
                                htmlFor="search"
                                value="Cari Periode Evaluasi"
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
                                    placeholder="Nama periode, tahun akademik, semester..."
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="academic_year_id"
                                value="Tahun Akademik"
                            />
                            <select
                                id="academic_year_id"
                                value={searchForm.data.academic_year_id}
                                onChange={(e) =>
                                    handleAcademicYearFilterChange(
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Tahun</option>
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {year.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="semester_id" value="Semester" />
                            <select
                                id="semester_id"
                                value={searchForm.data.semester_id}
                                onChange={(e) =>
                                    searchForm.setData(
                                        'semester_id',
                                        e.target.value,
                                    )
                                }
                                disabled={!searchForm.data.academic_year_id}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                                <option value="">Semua Semester</option>
                                {filteredSemesters.map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.nama}
                                    </option>
                                ))}
                            </select>
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

                        <div className="flex gap-2 sm:col-span-2 xl:col-span-5">
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
                                        Nama Periode
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Tahun / Semester
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Periode
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Evaluasi
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {evaluationPeriods.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            {hasActiveFilters
                                                ? 'Tidak ada periode evaluasi yang sesuai dengan filter.'
                                                : 'Belum ada data periode evaluasi.'}
                                        </td>
                                    </tr>
                                ) : (
                                    evaluationPeriods.data.map(
                                        (period, index) => (
                                            <tr
                                                key={period.id}
                                                className="hover:bg-slate-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    {(evaluationPeriods.from ??
                                                        1) + index}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                                    {period.nama}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    <div className="space-y-1">
                                                        <p>
                                                            {
                                                                period
                                                                    .academic_year
                                                                    ?.nama
                                                            }
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                period.semester
                                                                    ?.nama
                                                            }
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    <div className="space-y-1">
                                                        <p>
                                                            {formatDate(
                                                                period.start_date,
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            s/d{' '}
                                                            {formatDate(
                                                                period.end_date,
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                period.is_active
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                        >
                                                            {period.is_active
                                                                ? 'Aktif'
                                                                : 'Tidak Aktif'}
                                                        </span>
                                                        {period.is_locked && (
                                                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                                Terkunci
                                                            </span>
                                                        )}
                                                        <span
                                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                                period.is_anonymous
                                                                    ? 'bg-sky-100 text-sky-700'
                                                                    : 'bg-violet-100 text-violet-700'
                                                            }`}
                                                        >
                                                            {period.is_anonymous
                                                                ? 'Anonim'
                                                                : 'Terbuka'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    {period.evaluations_count}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-end text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(
                                                                'evaluation-periods.edit',
                                                                period.id,
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
                                                                    period,
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
                                        ),
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {evaluationPeriods.data.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <Pagination links={evaluationPeriods.links} />
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
                        Hapus Periode Evaluasi
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus periode evaluasi{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.nama}
                        </span>
                        ?
                        {deleteTarget?.evaluations_count > 0 && (
                            <span className="mt-2 block text-red-600">
                                Periode ini masih memiliki{' '}
                                {deleteTarget.evaluations_count} evaluasi dan
                                tidak dapat dihapus.
                            </span>
                        )}
                        {deleteTarget?.evaluations_count === 0 && (
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
                                deleteTarget?.evaluations_count > 0
                            }
                        >
                            Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
