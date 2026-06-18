import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import EvaluationScaleLegend from "@/Components/StudentEvaluations/EvaluationScaleLegend";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatKelasLabel } from "@/utils/kelas";
import { evaluationStatusLabels } from "@/utils/evaluationScale";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    HiOutlineCheckCircle,
    HiOutlineClock,
    HiOutlineDocumentText,
    HiOutlinePencilSquare,
} from "react-icons/hi2";

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const statusStyles = {
    pending: "bg-slate-100 text-slate-600",
    draft: "bg-amber-100 text-amber-700",
    submitted: "bg-emerald-100 text-emerald-700",
};

export default function Index({
    student,
    requiresStudentSelection,
    students,
    activePeriod,
    teachers,
    warnings,
}) {
    console.log({
        student,
        requiresStudentSelection,
        students,
        activePeriod,
        teachers,
        warnings,
    });
    const selectForm = useForm({
        student_id: "",
    });

    const submitStudentSelection = (e) => {
        e.preventDefault();
        selectForm.post(route("student-evaluations.select-student"));
    };

    return (
        <AdminLayout title="Evaluasi Siswa">
            <Head title="Evaluasi Siswa" />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-slate-600">
                        Isi evaluasi pembelajaran untuk guru yang mengajar kelas
                        Anda pada periode evaluasi aktif.
                    </p>
                </div>

                {requiresStudentSelection && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-6">
                        <h3 className="text-sm font-semibold text-amber-900">
                            Pilih Profil Siswa
                        </h3>
                        <p className="mt-2 text-sm text-amber-800">
                            Akun ini belum terhubung dengan data siswa. Pilih
                            siswa untuk simulasi pengisian evaluasi.
                        </p>

                        {students.length === 0 ? (
                            <p className="mt-4 text-sm text-amber-800">
                                Belum ada data siswa. Silakan{" "}
                                <Link
                                    href={route("students.create")}
                                    className="font-semibold underline"
                                >
                                    tambah siswa
                                </Link>{" "}
                                terlebih dahulu.
                            </p>
                        ) : (
                            <form
                                onSubmit={submitStudentSelection}
                                className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
                            >
                                <div className="flex-1">
                                    <InputLabel
                                        htmlFor="student_id"
                                        value="Siswa"
                                    />
                                    <select
                                        id="student_id"
                                        value={selectForm.data.student_id}
                                        onChange={(e) =>
                                            selectForm.setData(
                                                "student_id",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        <option value="">Pilih siswa</option>
                                        {students.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.nama} ({item.nis})
                                                {item.kelas
                                                    ? ` - ${formatKelasLabel(item.kelas)}`
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={selectForm.errors.student_id}
                                        className="mt-2"
                                    />
                                </div>
                                <PrimaryButton
                                    disabled={selectForm.processing}
                                    className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
                                >
                                    Gunakan Profil Ini
                                </PrimaryButton>
                            </form>
                        )}
                    </div>
                )}

                {student && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Profil Siswa
                        </h3>
                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                            <p>
                                <span className="font-medium text-slate-800">
                                    Nama:
                                </span>{" "}
                                {student.nama}
                            </p>
                            <p>
                                <span className="font-medium text-slate-800">
                                    NIS:
                                </span>{" "}
                                {student.nis}
                            </p>
                            <p>
                                <span className="font-medium text-slate-800">
                                    Kelas:
                                </span>{" "}
                                {student.kelas
                                    ? `${student.kelas.tingkatan ?? ""} ${student.kelas.nama}`.trim()
                                    : "Belum ditetapkan"}
                            </p>
                        </div>
                    </div>
                )}

                {activePeriod && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm sm:p-6">
                        <h3 className="text-sm font-semibold text-emerald-900">
                            Periode Evaluasi Aktif
                        </h3>
                        <div className="mt-3 grid gap-2 text-sm text-emerald-800 sm:grid-cols-2 lg:grid-cols-4">
                            <p>
                                <span className="font-medium">Nama:</span>{" "}
                                {activePeriod.nama}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Tahun Akademik:
                                </span>{" "}
                                {activePeriod.academic_year?.nama}
                            </p>
                            <p>
                                <span className="font-medium">Semester:</span>{" "}
                                {activePeriod.semester?.nama}
                            </p>
                            <p>
                                <span className="font-medium">Rentang:</span>{" "}
                                {formatDate(activePeriod.start_date)} -{" "}
                                {formatDate(activePeriod.end_date)}
                            </p>
                        </div>
                        {activePeriod.is_locked && (
                            <p className="mt-3 text-sm font-medium text-amber-800">
                                Periode ini terkunci. Pengisian dan pengiriman
                                evaluasi baru tidak dapat dilakukan.
                            </p>
                        )}
                    </div>
                )}

                {warnings.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <ul className="list-disc space-y-1 ps-5">
                            {warnings.map((warning) => (
                                <li key={warning}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <EvaluationScaleLegend compact />

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
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Rata-rata
                                    </th>
                                    <th className="px-6 py-3 text-end text-xs font-semibold uppercase tracking-wider text-slate-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {teachers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-10 text-center text-sm text-slate-500"
                                        >
                                            {student
                                                ? "Belum ada guru yang dapat dievaluasi."
                                                : "Pilih profil siswa untuk melihat daftar guru."}
                                        </td>
                                    </tr>
                                ) : (
                                    teachers.map((item, index) => (
                                        <tr
                                            key={item.teacher.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-800">
                                                {item.teacher.nama}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                {item.subjects.join(", ")}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                                                >
                                                    {item.status ===
                                                        "submitted" && (
                                                        <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                                                    )}
                                                    {item.status ===
                                                        "draft" && (
                                                        <HiOutlineDocumentText className="h-3.5 w-3.5" />
                                                    )}
                                                    {item.status ===
                                                        "pending" && (
                                                        <HiOutlineClock className="h-3.5 w-3.5" />
                                                    )}
                                                    {
                                                        evaluationStatusLabels[
                                                            item.status
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {item.evaluation
                                                    ?.average_score ?? "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-end text-sm">
                                                <Link
                                                    href={route(
                                                        "student-evaluations.teachers.show",
                                                        item.teacher.id,
                                                    )}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                >
                                                    <HiOutlinePencilSquare className="h-4 w-4" />
                                                    {item.status === "submitted"
                                                        ? "Lihat"
                                                        : item.status ===
                                                            "draft"
                                                          ? "Lanjutkan"
                                                          : "Isi Evaluasi"}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
