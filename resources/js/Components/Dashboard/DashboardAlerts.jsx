import {
    HiOutlineBell,
    HiOutlineCheckCircle,
    HiOutlineExclamationTriangle,
    HiOutlineInformationCircle,
} from 'react-icons/hi2';

const alertStyles = {
    info: {
        container: 'border-blue-200 bg-blue-50 text-blue-900',
        icon: HiOutlineInformationCircle,
        iconColor: 'text-blue-600',
    },
    warning: {
        container: 'border-amber-200 bg-amber-50 text-amber-900',
        icon: HiOutlineExclamationTriangle,
        iconColor: 'text-amber-600',
    },
    success: {
        container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
        icon: HiOutlineCheckCircle,
        iconColor: 'text-emerald-600',
    },
};

export default function DashboardAlerts({ alerts }) {
    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <HiOutlineBell className="h-5 w-5 text-slate-500" />
                <h3 className="text-base font-semibold text-slate-800">
                    Pemberitahuan Dashboard
                </h3>
            </div>

            <div className="grid gap-3">
                {alerts.map((alert, index) => {
                    const style = alertStyles[alert.type] ?? alertStyles.info;
                    const Icon = style.icon;

                    return (
                        <div
                            key={`${alert.title}-${index}`}
                            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${style.container}`}
                        >
                            <Icon
                                className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`}
                            />
                            <div>
                                <p className="text-sm font-semibold">{alert.title}</p>
                                <p className="mt-1 text-sm opacity-90">
                                    {alert.message}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
