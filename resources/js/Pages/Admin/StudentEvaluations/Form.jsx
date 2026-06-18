import EvaluationScaleLegend from '@/Components/StudentEvaluations/EvaluationScaleLegend';
import EvaluationQuestionList, {
    EvaluationFormActions,
} from '@/Components/StudentEvaluations/EvaluationQuestionList';
import SecondaryButton from '@/Components/SecondaryButton';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi2';

const formatDateTime = (value) => {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function Form({
    student,
    teacher,
    subjects,
    activePeriod,
    evaluation,
    questions,
    answers: initialAnswers,
    isReadOnly,
}) {
    const defaultAnswers = useMemo(() => {
        const mapped = {};

        questions.forEach((question) => {
            mapped[question.id] = initialAnswers[question.id] ?? null;
        });

        return mapped;
    }, [initialAnswers, questions]);

    const form = useForm({
        submit: false,
        answers: questions.map((question) => ({
            question_id: question.id,
            score: defaultAnswers[question.id],
        })),
    });

    const { data, setData, processing, errors } = form;

    const answerMap = useMemo(() => {
        return data.answers.reduce((carry, answer) => {
            carry[answer.question_id] = answer.score;

            return carry;
        }, {});
    }, [data.answers]);

    const updateAnswer = (questionId, score) => {
        setData(
            'answers',
            data.answers.map((answer) =>
                answer.question_id === questionId
                    ? { ...answer, score }
                    : answer,
            ),
        );
    };

    const saveDraft = () => {
        form.transform((payload) => ({
            ...payload,
            submit: false,
        })).put(route('student-evaluations.update', evaluation.id), {
            preserveScroll: true,
            onFinish: () => {
                form.transform((payload) => payload);
            },
        });
    };

    const submitEvaluation = () => {
        if (
            !window.confirm(
                'Evaluasi yang sudah dikirim tidak dapat diubah. Lanjutkan kirim evaluasi?',
            )
        ) {
            return;
        }

        form.transform((payload) => ({
            ...payload,
            submit: true,
        })).put(route('student-evaluations.update', evaluation.id), {
            preserveScroll: true,
            onFinish: () => {
                form.transform((payload) => payload);
            },
        });
    };

    return (
        <AdminLayout title="Form Evaluasi Guru">
            <Head title={`Evaluasi ${teacher.nama}`} />

            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            Evaluasi pembelajaran untuk guru pada periode
                            aktif.
                        </p>
                    </div>
                    <Link
                        href={route('student-evaluations.index')}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                        <HiOutlineArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar Guru
                    </Link>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Siswa
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {student.nama}
                            </p>
                            <p className="text-sm text-slate-600">
                                NIS: {student.nis}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Guru
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {teacher.nama}
                            </p>
                            <p className="text-sm text-slate-600">
                                {subjects.join(', ')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Periode
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {activePeriod.nama}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status Evaluasi
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {evaluation.status === 'submitted'
                                    ? 'Terkirim'
                                    : evaluation.status === 'draft'
                                      ? 'Draft'
                                      : 'Belum Diisi'}
                            </p>
                            {evaluation.submitted_at && (
                                <p className="text-sm text-slate-600">
                                    Dikirim:{' '}
                                    {formatDateTime(evaluation.submitted_at)}
                                </p>
                            )}
                        </div>
                    </div>

                    {isReadOnly && (
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                            {evaluation.status === 'submitted'
                                ? 'Evaluasi ini sudah dikirim dan tidak dapat diubah.'
                                : 'Periode evaluasi terkunci sehingga evaluasi tidak dapat diubah.'}
                        </div>
                    )}
                </div>

                <EvaluationScaleLegend compact />

                <EvaluationQuestionList
                    questions={questions}
                    answers={answerMap}
                    errors={errors}
                    readOnly={isReadOnly}
                    onChange={updateAnswer}
                />

                {!isReadOnly && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                        <EvaluationFormActions
                            processing={processing}
                            readOnly={isReadOnly}
                            onSaveDraft={saveDraft}
                            onSubmit={submitEvaluation}
                        />
                    </div>
                )}

                {isReadOnly && (
                    <div className="flex justify-end">
                        <Link href={route('student-evaluations.index')}>
                            <SecondaryButton type="button">
                                Kembali
                            </SecondaryButton>
                        </Link>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
