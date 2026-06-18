import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { evaluationScale } from "@/utils/evaluationScale";

export function EvaluationQuestionList({
    questions = [],
    answers = {},
    errors = {},
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
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                                    {evaluationScale.map((scale) => {
                                        const isSelected =
                                            Number(answers[question.id]) ===
                                            scale.score;

                                        // ID unik untuk sinkronisasi klik label & radio input
                                        const inputId = `q_${question.id}_s_${scale.score}`;

                                        return (
                                            <label
                                                htmlFor={inputId}
                                                key={scale.score}
                                                className={`flex cursor-pointer flex-col items-center rounded-lg border px-3 py-3 text-center transition ${
                                                    isSelected
                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold shadow-sm ring-1 ring-emerald-500"
                                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-slate-100/50"
                                                } ${readOnly ? "cursor-default opacity-60 pointer-events-none" : ""}`}
                                            >
                                                <input
                                                    id={inputId}
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
                                                <span className="mt-1 text-xs font-medium">
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

            {errors.answers && (
                <InputError message={errors.answers} className="mt-2" />
            )}
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
        <div className="flex items-center justify-end gap-3 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200 mt-6">
            <SecondaryButton
                type="button"
                onClick={onSaveDraft}
                disabled={processing}
                className="rounded-xl px-6 py-2.5"
            >
                {processing ? "Menyimpan..." : "Simpan Draft"}
            </SecondaryButton>

            <PrimaryButton
                type="button"
                onClick={onSubmit}
                disabled={processing}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 focus:bg-emerald-700 px-8 py-2.5 text-white shadow-sm"
            >
                {processing ? "Mengirim..." : "Kirim Evaluasi"}
            </PrimaryButton>
        </div>
    );
}
