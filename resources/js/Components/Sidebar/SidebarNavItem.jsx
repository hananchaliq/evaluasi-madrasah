import { Link } from '@inertiajs/react';

export default function SidebarNavItem({ item, isActive, onNavigate }) {
    const Icon = item.icon;
    const baseClasses =
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150';

    const activeClasses =
        'bg-emerald-600/20 text-emerald-300 ring-1 ring-inset ring-emerald-500/30';
    const inactiveClasses =
        'text-slate-300 hover:bg-slate-800 hover:text-white';
    const disabledClasses =
        'cursor-not-allowed text-slate-500 hover:bg-transparent hover:text-slate-500';

    const className = `${baseClasses} ${
        item.route === null
            ? disabledClasses
            : isActive
              ? activeClasses
              : inactiveClasses
    }`;

    const content = (
        <>
            <Icon
                className={`h-5 w-5 shrink-0 ${
                    item.route === null
                        ? 'text-slate-600'
                        : isActive
                          ? 'text-emerald-400'
                          : 'text-slate-400 group-hover:text-slate-200'
                }`}
                aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
            {item.route === null && (
                <span className="ms-auto rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Segera
                </span>
            )}
        </>
    );

    if (item.route === null) {
        return (
            <span className={className} title="Modul akan segera tersedia">
                {content}
            </span>
        );
    }

    return (
        <Link
            href={route(item.route)}
            className={className}
            onClick={onNavigate}
        >
            {content}
        </Link>
    );
}
