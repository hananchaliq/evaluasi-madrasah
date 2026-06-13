import { Link } from '@inertiajs/react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex flex-wrap items-center justify-between gap-3"
            aria-label="Paginasi"
        >
            <p className="text-sm text-slate-600">
                {links[0].label.includes('Previous') ||
                links[links.length - 1].label.includes('Next')
                    ? 'Navigasi halaman'
                    : 'Halaman'}
            </p>

            <div className="flex flex-wrap items-center gap-1">
                {links.map((link, index) => {
                    if (link.label.includes('Previous')) {
                        return (
                            <PaginationLink
                                key={index}
                                link={link}
                                label="Sebelumnya"
                                icon={HiOutlineChevronLeft}
                            />
                        );
                    }

                    if (link.label.includes('Next')) {
                        return (
                            <PaginationLink
                                key={index}
                                link={link}
                                label="Berikutnya"
                                icon={HiOutlineChevronRight}
                                iconPosition="right"
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveState
                            preserveScroll
                            className={`inline-flex min-w-9 items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition ${
                                link.active
                                    ? 'bg-emerald-600 text-white'
                                    : link.url
                                      ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                      : 'cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-400'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </nav>
    );
}

function PaginationLink({ link, label, icon: Icon, iconPosition = 'left' }) {
    const baseClasses =
        'inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition';

    if (!link.url) {
        return (
            <span
                className={`${baseClasses} cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400`}
            >
                {iconPosition === 'left' && <Icon className="h-4 w-4" />}
                {label}
                {iconPosition === 'right' && <Icon className="h-4 w-4" />}
            </span>
        );
    }

    return (
        <Link
            href={link.url}
            preserveState
            preserveScroll
            className={`${baseClasses} border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
        >
            {iconPosition === 'left' && <Icon className="h-4 w-4" />}
            {label}
            {iconPosition === 'right' && <Icon className="h-4 w-4" />}
        </Link>
    );
}
