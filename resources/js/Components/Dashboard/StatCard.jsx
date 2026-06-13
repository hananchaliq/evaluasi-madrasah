export default function StatCard({ label, value, description, icon: Icon, accent = 'emerald' }) {
    const accents = {
        emerald: 'bg-emerald-500',
        blue: 'bg-blue-500',
        violet: 'bg-violet-500',
        amber: 'bg-amber-500',
        rose: 'bg-rose-500',
        cyan: 'bg-cyan-500',
        indigo: 'bg-indigo-500',
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
                </div>
                <div
                    className={`shrink-0 rounded-lg p-2.5 text-white ${accents[accent] ?? accents.emerald}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            {description && (
                <p className="mt-3 text-xs text-slate-500">{description}</p>
            )}
        </div>
    );
}
