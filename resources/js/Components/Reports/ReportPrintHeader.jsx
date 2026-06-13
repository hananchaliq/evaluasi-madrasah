const formatGeneratedAt = (value) => {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatPeriodRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
        return '-';
    }

    const formatter = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
};

export default function ReportPrintHeader({ report, filterLabels }) {
    return (
        <div className="report-print-header rounded-xl border border-slate-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none">
            <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {report.institution}
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
                    {report.title}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    {report.description}
                </p>
            </div>

            <div className="mt-6 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Filter Aktif
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                        {filterLabels.map((item) => (
                            <li key={`${item.label}-${item.value}`}>
                                <span className="font-medium text-slate-800">
                                    {item.label}:
                                </span>{' '}
                                {item.value}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="sm:text-end">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Dicetak Pada
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                        {formatGeneratedAt(report.generatedAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}

export { formatPeriodRange };
