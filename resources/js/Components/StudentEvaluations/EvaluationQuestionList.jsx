import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { evaluationScale } from '@/utils/evaluationScale';

export default function EvaluationQuestionList({
    questions,
    answers,
    errors,
    readOnly = false,
    onChange,
}) {
    return (
        <div className="space-y-6">
            {questions.map((question, index) => (
                <div
                    key={question.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
                >
                    <div className="flex gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                            {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800 sm:text-base">
                                {question.pertanyaan}
                            </p>

                            <div className="mt-4">
                                <InputLabel
                                    value="Pilih Skor"
                                    className="sr-only"
                                />
                                <div className="grid gap-2 sm:grid-cols-5">
                                    {evaluationScale.map((scale) => {
                                        const isSelected =
                                            Number(answers[question.id]) ===
                                            scale.score;

                                        return (
                                            <label
                                                key={scale.score}
                                                className={`flex cursor-pointer flex-col items-center rounded-lg border px-3 py-3 text-center transition ${
                                                    isSelected
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300'
                                                } ${readOnly ? 'cursor-default opacity-80' : ''}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question_${question.id}`}
                                                    value={scale.score}
                                                    checked={isSelected}
                                                    disabled={readOnly}
                                                    onChange={() =>
                                                        onChange(
                                                            question.id,
                                                            scale.score,
                                                        )
                                                    }
                                                    className="sr-only"
                                                />
                                                <span className="text-lg font-bold">
                                                    {scale.score}
                                                </span>
                                                <span className="mt-1 text-xs font-semibold">
                                                    {scale.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <InputError message={errors.answers} className="mt-2" />
        </div>
    );
}

export function EvaluationFormActions({
    processing,
    readOnly,
    onSaveDraft,
    onSubmit,
}) {
    if (readOnly) {
        return null;
    }

    return (
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <SecondaryButton
                type="button"
                onClick={onSaveDraft}
                disabled={processing}
            >
                Simpan Draft
            </SecondaryButton>
            <PrimaryButton
                type="button"
                onClick={onSubmit}
                disabled={processing}
                className="bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700"
            >
                Kirim Evaluasi
            </PrimaryButton>
        </div>
    );
}
