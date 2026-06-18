import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatKelasLabel } from '@/utils/kelas';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlinePlus,
    HiOutlineTrash,
} from 'react-icons/hi2';

export default function Index({
    assignments,
    filters,
    teachers,
    kelasList,
    academicYears,
    semesters,
}) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const searchForm = useForm({
        search: filters.search || '',
        academic_year_id: filters.academic_year_id || '',
        semester_id: filters.semester_id || '',
        teacher_id: filters.teacher_id || '',
        kelas_id: filters.kelas_id || '',
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

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('admin.teaching-assignments.index'),
            {
                search: searchForm.data.search || undefined,
                academic_year_id:
                    searchForm.data.academic_year_id || undefined,
                semester_id: searchForm.data.semester_id || undefined,
                teacher_id: searchForm.data.teacher_id || undefined,
                kelas_id: searchForm.data.kelas_id || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleResetSearch = () => {
        searchForm.setData({
            search: '',
            academic_year_id: '',
            semester_id: '',
            teacher_id: '',
            kelas_id: '',
        });
        router.get(
            route('admin.teaching-assignments.index'),
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

    const openDeleteModal = (assignment) => {
        setDeleteTarget(assignment);
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
            route('admin.teaching-assignments.destroy', deleteTarget.id),
            {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
            },
        );
    };

    const hasActiveFilters =
        filters.search ||
        filters.academic_year_id ||
        filters.semester_id ||
        filters.teacher_id ||
        filters.kelas_id;

    return (
        <AdminLayout title="Penugasan Mengajar">
            <Head title="Penugasan Mengajar" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            Kelola penugasan guru mengajar mata pelajaran pada
                            kelas, tahun akademik, dan semester tertentu.
                        </p>
                    </div>
                    <Link
                        href={route('admin.teaching-assignments.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <HiOutlinePlus className="h-4 w-4" />
                        Tambah Penugasan
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="search" value="Cari" />
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
                                    placeholder="Guru, mata pelajaran, atau kelas..."
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <InputLabel
                                    htmlFor="filter_teacher_id"
                                    value="Guru"
                                />
                                <select
                                    id="filter_teacher_id"
                                    value={searchForm.data.teacher_id}
                                    onChange={(e) =>
                                        searchForm.setData(
                                            'teacher_id',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Semua Guru</option>
                                    {teachers.map((teacher) => (
                                        <option
                                            key={teacher.id}
                                            value={teacher.id}
                                        >
                                            {teacher.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="filter_kelas_id"
                                    value="Kelas"
                                />
                                <select
                                    id="filter_kelas_id"
                                    value={searchForm.data.kelas_id}
                                    onChange={(e) =>
                                        searchForm.setData(
                                            'kelas_id',
                                            e.target.value,
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasList.map((kelas) => (
                                        <option key={kelas.id} value={kelas.id}>
                                            {formatKelasLabel(kelas)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="filter_academic_year_id"
                                    value="Tahun Akademik"
                                />
                                <select
                                    id="filter_academic_year_id"
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
                                <InputLabel
                                    htmlFor="filter_semester_id"
                                    value="Semester"
                                />
                                <select
                                    id="filter_semester_id"
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
                                        <option
                                            key={semester.id}
                                            value={semester.id}
                                        >
                                            {semester.nama}
                                        </option>
                                    ))}
                                </select>
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
                                        Guru
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Mata Pelajaran
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Kelas
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Tahun Akademik
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Semester
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {assignments.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            {hasActiveFilters
                                                ? 'Tidak ada penugasan yang sesuai dengan filter.'
                                                : 'Belum ada data penugasan mengajar.'}
                                        </td>
                                    </tr>
                                ) : (
                                    assignments.data.map((assignment, index) => (
                                        <tr
                                            key={assignment.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {(assignments.from ?? 1) + index}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                                                {assignment.teacher?.nama ?? '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-800">
                                                {assignment.subject?.nama ?? '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {assignment.kelas
                                                    ? formatKelasLabel(
                                                          assignment.kelas,
                                                      )
                                                    : '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {assignment.academic_year
                                                    ?.nama ?? '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {assignment.semester?.nama ??
                                                    '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-end text-sm">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'admin.teaching-assignments.edit',
                                                            assignment.id,
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
                                                                assignment,
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

                    {assignments.data.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <Pagination links={assignments.links} />
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
                        Hapus Penugasan Mengajar
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Apakah Anda yakin ingin menghapus penugasan{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.teacher?.nama}
                        </span>{' '}
                        mengajar{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.subject?.nama}
                        </span>{' '}
                        di kelas{' '}
                        <span className="font-semibold text-slate-800">
                            {deleteTarget?.kelas
                                ? formatKelasLabel(deleteTarget.kelas)
                                : '—'}
                        </span>
                        ?
                        <span className="mt-2 block">
                            Tindakan ini tidak dapat dibatalkan.
                        </span>
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
