import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import {
    HiOutlineAcademicCap,
    HiOutlineBookOpen,
    HiOutlineClipboardDocumentList,
    HiOutlineDocumentArrowDown,
    HiOutlineDocumentText,
    HiOutlineUserGroup,
    HiOutlineUsers,
} from "react-icons/hi2";

export default function Index({ exports }) {
    const icons = {
        teachers: HiOutlineUserGroup,
        students: HiOutlineUsers,
        kelas: HiOutlineAcademicCap,
        subjects: HiOutlineBookOpen,
        assignments: HiOutlineClipboardDocumentList,
        evaluations: HiOutlineDocumentText,
    };

    return (
        <AdminLayout title="Export Data">
            <Head title="Export Data" />

            <div className="space-y-6">
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6">
                    <h2 className="text-lg font-semibold text-emerald-900">
                        Export Data Sistem Evaluasi
                    </h2>

                    <p className="mt-2 text-sm text-emerald-800">
                        Export data master dan laporan dalam format Excel maupun
                        PDF.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {exports.map((item) => {
                        const Icon =
                            icons[item.module] ?? HiOutlineDocumentArrowDown;

                        return (
                            <div
                                key={item.module}
                                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="rounded-lg bg-emerald-100 p-3">
                                        <Icon className="h-6 w-6 text-emerald-700" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold text-slate-800">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    {/* EXCEL (tetep Inertia boleh kalau return download/file) */}
                                    <a
                                        href={route(
                                            `admin.exports.${item.module}.excel`,
                                        )}
                                        className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        Excel
                                    </a>

                                    {/* PDF (WAJIB anchor biasa) */}
                                    <a
                                        href={route(
                                            `admin.exports.${item.module}.pdf`,
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        PDF
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}
