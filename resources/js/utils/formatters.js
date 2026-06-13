export function formatNumber(value, options = {}) {
    if (value === null || value === undefined) {
        return '—';
    }

    return new Intl.NumberFormat('id-ID', options).format(value);
}

export function formatPercent(value) {
    if (value === null || value === undefined) {
        return '—';
    }

    return `${formatNumber(value, { maximumFractionDigits: 1 })}%`;
}

export function formatScore(value) {
    if (value === null || value === undefined) {
        return '—';
    }

    return formatNumber(value, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}
