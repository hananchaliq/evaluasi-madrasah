import {
    EvaluationQuestionList,
    EvaluationFormActions,
} from "@/Components/StudentEvaluations/EvaluationQuestionList";
import EvaluationScaleLegend from "@/Components/StudentEvaluations/EvaluationScaleLegend";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";
import {
    HiOutlineArrowLeft,
    HiOutlineUser,
    HiCheckCircle,
} from "react-icons/hi2";

export default function EvaluationForm({
    teacher,
    subjects = [],
    activePeriod,
    evaluation,
    questions = [],
    answers: initialAnswers = {},
    isReadOnly,
}) {
    // State lokal untuk notifikasi toast transparan
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const defaultAnswers = useMemo(() => {
        const mapped = {};
        questions.forEach((question) => {
            mapped[question.id] = initialAnswers[question.id] ?? null;
        });
        return mapped;
    }, [initialAnswers, questions]);

    const form = useForm({
        answers: questions.map((question) => ({
            question_id: question.id,
            score: defaultAnswers[question.id],
        })),
    });

    const { data, setData, put, processing, errors } = form;

    const answerMap = useMemo(() => {
        return data.answers.reduce((carry, answer) => {
            carry[answer.question_id] = answer.score;
            return carry;
        }, {});
    }, [data.answers]);

    const updateAnswer = (questionId, score) => {
        setData(
            "answers",
            data.answers.map((answer) =>
                answer.question_id === questionId
                    ? {
                          ...answer,
                          score: score !== null ? parseInt(score, 10) : null,
                      }
                    : answer,
            ),
        );
    };

    const showNotification = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(
            () => setToast({ show: false, message: "", type: "" }),
            3500,
        );
    };

    const saveDraft = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        form.transform((payload) => ({
            ...payload,
            submit: false,
        }));

        form.put(route("student.evaluations.update", evaluation.id), {
            preserveScroll: true,
            onSuccess: () => {
                showNotification(
                    "Draft evaluasi berhasil disimpan!",
                    "success",
                );
            },
            onError: () => {
                showNotification(
                    "Gagal menyimpan draft. Periksa kembali jaringan Anda.",
                    "error",
                );
            },
        });
    };

    const submitEvaluation = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (
            !window.confirm(
                "Evaluasi yang sudah dikirim tidak dapat diubah. Lanjutkan?",
            )
        ) {
            return;
        }

        form.transform((payload) => ({
            ...payload,
            submit: true,
        }));

        form.put(route("student.evaluations.update", evaluation.id), {
            preserveScroll: true,
            onSuccess: () => {
                showNotification(
                    "Evaluasi sukses dikirim ke sistem!",
                    "success",
                );
            },
            onError: () => {
                showNotification(
                    "Gagal mengirim! Pastikan semua pertanyaan telah diisi.",
                    "error",
                );
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Isi Evaluasi Guru
                    </h2>
                    <Link
                        href={route("student.dashboard")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Kembali ke Dashboard
                    </Link>
                </div>
            }
        >
            <Head title={`Evaluasi ${teacher.nama}`} />

            {/* Toast Notification Minimalis */}
            {toast.show && (
                <div className="fixed bottom-5 right-5 z-50 animate-fade-in-up">
                    <div
                        className={`flex items-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-xl backdrop-blur-md border ${
                            toast.type === "success"
                                ? "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                                : "bg-red-50/90 border-red-200 text-red-800"
                        }`}
                    >
                        {toast.type === "success" && (
                            <HiCheckCircle className="h-5 w-5 text-emerald-600" />
                        )}
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="space-y-6"
                >
                    {Object.keys(errors).length > 0 && (
                        <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-sm text-red-600 animate-pulse">
                            <p className="font-bold mb-1">
                                Gagal memproses data! Silakan lengkapi opsi
                                berikut:
                            </p>
                            <ul className="list-disc pl-5 space-y-0.5 font-medium">
                                {Object.values(errors).map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Header Info Bento Box */}
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="bg-slate-50/50 p-6 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                        <HiOutlineUser className="h-9 w-9" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {teacher.nama}
                                        </h3>
                                        <p className="text-slate-600 font-medium text-sm">
                                            {Array.isArray(subjects)
                                                ? subjects.join(", ")
                                                : subjects}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Periode
                                    </p>
                                    <p className="font-bold text-slate-800">
                                        {activePeriod.nama}
                                    </p>
                                    <div
                                        className={`mt-1.5 inline-flex rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                            evaluation.status === "submitted"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {evaluation.status === "submitted"
                                            ? "Terkirim"
                                            : "Draft"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <EvaluationScaleLegend />

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        <div className="p-6 sm:p-8">
                            <EvaluationQuestionList
                                questions={questions}
                                answers={answerMap}
                                errors={errors}
                                readOnly={isReadOnly}
                                onChange={updateAnswer}
                            />
                        </div>
                    </div>

                    <EvaluationFormActions
                        processing={processing}
                        readOnly={isReadOnly}
                        onSaveDraft={(e) => saveDraft(e)}
                        onSubmit={(e) => submitEvaluation(e)}
                    />

                    {isReadOnly && (
                        <div className="rounded-2xl bg-amber-50/80 backdrop-blur-sm p-6 text-center ring-1 ring-amber-200">
                            <p className="text-sm font-medium text-amber-800">
                                Evaluasi ini sudah dikirim atau periode evaluasi
                                telah berakhir. Anda tidak dapat mengubah
                                jawaban lagi.
                            </p>
                            <Link
                                href={route("student.dashboard")}
                                className="mt-4 inline-block text-sm font-bold text-amber-900 underline hover:text-amber-950"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
