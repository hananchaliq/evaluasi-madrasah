import { evaluationScale } from '@/utils/evaluationScale';

export default function EvaluationScaleLegend({ compact = false }) {
    return (
        <div
            className={`rounded-xl border border-slate-200 bg-white shadow-sm ${
                compact ? 'p-4' : 'p-4 sm:p-6'
            }`}
        >
            <h3 className="text-sm font-semibold text-slate-800">
                Skala Penilaian
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
    );
}
