import InputLabel from '@/Components/InputLabel';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    HiOutlineArrowDownTray,
    HiOutlineArrowRightOnRectangle,
    HiOutlineArrowUpTray,
    HiOutlineDocumentText,
    HiOutlineMagnifyingGlass,
    HiOutlinePencilSquare,
    HiOutlinePlusCircle,
    HiOutlineShieldCheck,
    HiOutlineTrash,
    HiOutlineUserCircle,
} from 'react-icons/hi2';

const actionStyles = {
    login: {
        badge: 'bg-blue-100 text-blue-700',
        icon: HiOutlineUserCircle,
    },
    logout: {
        badge: 'bg-slate-100 text-slate-700',
        icon: HiOutlineArrowRightOnRectangle,
    },
    create: {
        badge: 'bg-emerald-100 text-emerald-700',
        icon: HiOutlinePlusCircle,
    },
    update: {
        badge: 'bg-amber-100 text-amber-700',
        icon: HiOutlinePencilSquare,
    },
    delete: {
        badge: 'bg-rose-100 text-rose-700',
        icon: HiOutlineTrash,
    },
    import: {
        badge: 'bg-violet-100 text-violet-700',
        icon: HiOutlineArrowUpTray,
    },
    export: {
        badge: 'bg-cyan-100 text-cyan-700',
        icon: HiOutlineArrowDownTray,
    },
};

export default function Index({
    auditLogs,
    filters,
    summary,
    actionOptions,
    users,
}) {
    const searchForm = useForm({
        search: filters.search || '',
        action: filters.action || '',
        user_id: filters.user_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const handleSearch = (e) => {
        e.preventDefault();

        router.get(
            route('admin.audit-logs.index'),
            {
                search: searchForm.data.search || undefined,
                action: searchForm.data.action || undefined,
                user_id: searchForm.data.user_id || undefined,
                date_from: searchForm.data.date_from || undefined,
                date_to: searchForm.data.date_to || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleResetSearch = () => {
        searchForm.setData({
            search: '',
            action: '',
            user_id: '',
            date_from: '',
            date_to: '',
        });

        router.get(route('admin.audit-logs.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout title="Log Audit">
            <Head title="Log Audit" />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-slate-600">
                        Pantau aktivitas pengguna sistem seperti masuk, keluar,
                        tambah, ubah, hapus, import, dan ekspor data.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Total Log</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                            {summary.total}
                        </p>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                        <p className="text-sm text-blue-700">Hari Ini</p>
                        <p className="mt-1 text-2xl font-bold text-blue-800">
                            {summary.today}
                        </p>
                    </div>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                        <p className="text-sm text-emerald-700">Tambah</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-800">
                            {summary.create}
                        </p>
                    </div>
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                        <p className="text-sm text-amber-700">Ubah</p>
                        <p className="mt-1 text-2xl font-bold text-amber-800">
                            {summary.update}
                        </p>
                    </div>
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
                        <p className="text-sm text-rose-700">Hapus</p>
                        <p className="mt-1 text-2xl font-bold text-rose-800">
                            {summary.delete}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-sm text-slate-500">Masuk</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                            {summary.login}
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <form
                        onSubmit={handleSearch}
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
                    >
                        <div className="sm:col-span-2 xl:col-span-2">
                            <InputLabel htmlFor="search" value="Cari Log" />
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
                                    placeholder="Aktivitas, nama, atau email..."
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="action" value="Jenis Aktivitas" />
                            <select
                                id="action"
                                value={searchForm.data.action}
                                onChange={(e) =>
                                    searchForm.setData('action', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Jenis</option>
                                {actionOptions.map((option) => (
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
                            <InputLabel htmlFor="user_id" value="Pengguna" />
                            <select
                                id="user_id"
                                value={searchForm.data.user_id}
                                onChange={(e) =>
                                    searchForm.setData('user_id', e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                            >
                                <option value="">Semua Pengguna</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="date_from" value="Dari Tanggal" />
                            <TextInput
                                id="date_from"
                                type="date"
                                value={searchForm.data.date_from}
                                onChange={(e) =>
                                    searchForm.setData(
                                        'date_from',
                                        e.target.value,
                                    )
                                }
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="date_to" value="Sampai Tanggal" />
                            <TextInput
                                id="date_to"
                                type="date"
                                value={searchForm.data.date_to}
                                onChange={(e) =>
                                    searchForm.setData('date_to', e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div className="flex gap-2 sm:col-span-2 xl:col-span-6">
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
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h3 className="text-base font-semibold text-slate-800">
                            Riwayat Aktivitas
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Daftar aktivitas sistem yang tercatat otomatis.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Waktu
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Pengguna
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Jenis
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aktivitas
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        IP
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {auditLogs.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            <HiOutlineShieldCheck className="mx-auto h-8 w-8 text-slate-300" />
                                            <span className="mt-2 block">
                                                Tidak ada log audit yang sesuai
                                                filter.
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.data.map((log) => {
                                        const style =
                                            actionStyles[log.action] ??
                                            actionStyles.update;
                                        const Icon = style.icon;

                                        return (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-slate-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {log.user ? (
                                                        <div>
                                                            <p className="font-medium text-slate-800">
                                                                {log.user.name}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {log.user.email}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-500">
                                                            Sistem
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                                                    >
                                                        <Icon className="h-3.5 w-3.5" />
                                                        {log.action_label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">
                                                    <div className="flex items-start gap-2">
                                                        <HiOutlineDocumentText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                                        <span>{log.activity}</span>
                                                    </div>
                                                    {log.subject_type &&
                                                        log.subject_id && (
                                                            <p className="mt-1 text-xs text-slate-400">
                                                                {log.subject_type}{' '}
                                                                #{log.subject_id}
                                                            </p>
                                                        )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                    {log.ip_address || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {auditLogs.data.length > 0 && (
                        <div className="border-t border-slate-200 px-6 py-4">
                            <Pagination links={auditLogs.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
