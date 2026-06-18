<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $report['title'] }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', Arial, Helvetica, sans-serif;
            color: #111827;
            background: white;
            margin: 0;
            padding: 28px 32px;
            font-size: 11px;
            line-height: 1.5;
        }

        h1, h2, h3 {
            margin: 0;
            color: #0f172a;
        }

        h1 {
            font-size: 20px;
            letter-spacing: -0.02em;
        }

        h2 {
            font-size: 13px;
            font-weight: 400;
            margin-top: 4px;
            color: #475569;
        }

        /* ── Header ── */
        .report-header {
            border-bottom: 3px solid #0f766e;
            padding-bottom: 16px;
            margin-bottom: 20px;
        }

        .institution {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: #0f766e;
            margin-bottom: 6px;
        }

        .report-meta {
            margin-top: 10px;
            font-size: 10px;
            color: #64748b;
            line-height: 1.65;
        }

        .report-meta span {
            display: inline-block;
            margin-right: 18px;
        }

        /* ── Filters ── */
        .filters {
            margin-top: 12px;
            font-size: 10px;
            color: #334155;
        }

        .filters strong {
            font-size: 10px;
            color: #0f172a;
        }

        .filters ul {
            list-style: none;
            padding: 0;
            margin: 4px 0 0 0;
        }

        .filters li {
            display: inline-block;
            margin-right: 16px;
            margin-bottom: 2px;
        }

        .filters li::before {
            content: "•";
            color: #0f766e;
            margin-right: 4px;
            font-weight: 700;
        }

        /* ── Summary Cards (table-based for DomPDF) ── */
        .summary-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
            margin: 16px -8px 20px;
        }

        .summary-table td {
            background: #f0fdfa;
            border: 1px solid #ccfbf1;
            border-radius: 6px;
            padding: 10px 12px;
            width: 25%;
            vertical-align: top;
        }

        .summary-label {
            font-size: 9px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 4px;
        }

        .summary-value {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
        }

        /* ── Data Table ── */
        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            font-size: 10px;
        }

        .report-table th,
        .report-table td {
            border: 1px solid #e2e8f0;
            padding: 7px 10px;
            vertical-align: top;
            text-align: left;
        }

        .report-table th {
            background: #f8fafc;
            color: #475569;
            font-weight: 700;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
        }

        .report-table tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 700;
        }

        .badge-active {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-inactive {
            background: #f1f5f9;
            color: #475569;
        }

        .badge-locked {
            background: #fef3c7;
            color: #92400e;
        }

        /* ── Footer ── */
        .report-footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
            font-size: 9px;
            color: #94a3b8;
            text-align: center;
        }

        .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
        }

        .row-number {
            color: #94a3b8;
            text-align: center;
            width: 30px;
        }

        .score-highlight {
            font-weight: 700;
            color: #0f766e;
        }

        /* Page breaks */
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    @php
        $labelHeader = match ($reportType) {
            'teacher'  => 'Guru',
            'class'    => 'Kelas',
            'subject'  => 'Mata Pelajaran',
            'category' => 'Kategori Mapel',
            default    => 'Entitas',
        };

        $fmtScore = function ($value) {
            return $value === null ? '-' : number_format($value, 2, ',', '.');
        };

        $fmtNumber = function ($value) {
            return $value === null ? '-' : number_format($value, 0, ',', '.');
        };

        $fmtPercent = function ($value) {
            return $value === null ? '-' : number_format($value, 1, ',', '.') . ' %';
        };

        $fmtRange = function ($from, $to) {
            return sprintf('%s s/d %s', $from, $to);
        };
    @endphp

    {{-- ── Report Header ── --}}
    <section class="report-header">
        <div class="institution">{{ $report['institution'] }}</div>
        <h1>{{ $report['title'] }}</h1>
        <h2>{{ $report['description'] }}</h2>

        <div class="report-meta">
            <span>Dihasilkan pada: {{ \Carbon\Carbon::parse($report['generatedAt'])->translatedFormat('d F Y, H:i') }} WIB</span>
        </div>

        <div class="filters">
            <strong>Filter aktif:</strong>
            <ul>
                @foreach ($filterLabels as $filter)
                    <li>{{ $filter['label'] }}: {{ $filter['value'] }}</li>
                @endforeach
            </ul>
        </div>
    </section>

    {{-- ── Summary Cards ── --}}
    <table class="summary-table">
        <tr>
            <td>
                <div class="summary-label">Rata-rata Skor</div>
                <div class="summary-value">{{ $fmtScore($summary['average_score']) }}</div>
            </td>
            <td>
                <div class="summary-label">Skor Tertinggi</div>
                <div class="summary-value">{{ $fmtScore($summary['highest_score']) }}</div>
            </td>
            <td>
                <div class="summary-label">Skor Terendah</div>
                <div class="summary-value">{{ $fmtScore($summary['lowest_score']) }}</div>
            </td>
            <td>
                <div class="summary-label">Total Respons</div>
                <div class="summary-value">{{ $fmtNumber($summary['total_responses']) }}</div>
            </td>
        </tr>
    </table>

    {{-- ── Statistics Table ── --}}
    <div class="section-title">
        @if ($reportType === 'evaluation_period')
            Rincian Per Periode Evaluasi
        @else
            Rincian Per {{ $labelHeader }}
        @endif
    </div>

    <table class="report-table">
        <thead>
            <tr>
                <th class="row-number">No</th>
                @if ($reportType === 'evaluation_period')
                    <th>Periode</th>
                    <th>Tahun / Semester</th>
                    <th>Rentang Tanggal</th>
                    <th>Status</th>
                    <th class="text-right">Rata-rata</th>
                    <th class="text-right">Respons</th>
                    <th class="text-right">Tingkat Respons</th>
                @else
                    <th>{{ $labelHeader }}</th>
                    <th class="text-right">Rata-rata Skor</th>
                    <th class="text-right">Skor Tertinggi</th>
                    <th class="text-right">Skor Terendah</th>
                    <th class="text-right">Total Respons</th>
                @endif
            </tr>
        </thead>
        <tbody>
            @forelse ($statistics as $index => $row)
                <tr>
                    <td class="row-number">{{ $index + 1 }}</td>
                    @if ($reportType === 'evaluation_period')
                        <td>{{ $row['label'] }}</td>
                        <td>{{ $row['academic_year'] }} / {{ $row['semester'] }}</td>
                        <td>{{ $fmtRange($row['start_date'], $row['end_date']) }}</td>
                        <td>
                            <span class="badge {{ $row['is_active'] ? 'badge-active' : 'badge-inactive' }}">
                                {{ $row['is_active'] ? 'Aktif' : 'Tidak Aktif' }}
                            </span>
                            @if ($row['is_locked'])
                                <span class="badge badge-locked">Terkunci</span>
                            @endif
                        </td>
                        <td class="text-right score-highlight">{{ $fmtScore($row['average_score']) }}</td>
                        <td class="text-right">
                            {{ $fmtNumber($row['total_responses']) }} / {{ $fmtNumber($row['expected_responses']) }}
                        </td>
                        <td class="text-right">{{ $fmtPercent($row['response_rate']) }}</td>
                    @else
                        <td>{{ $row['label'] }}</td>
                        <td class="text-right score-highlight">{{ $fmtScore($row['average_score']) }}</td>
                        <td class="text-right">{{ $fmtScore($row['highest_score']) }}</td>
                        <td class="text-right">{{ $fmtScore($row['lowest_score']) }}</td>
                        <td class="text-right">{{ $fmtNumber($row['total_responses']) }}</td>
                    @endif
                </tr>
            @empty
                <tr>
                    <td colspan="{{ $reportType === 'evaluation_period' ? 8 : 6 }}" class="text-center" style="padding: 20px; color: #94a3b8;">
                        Belum ada data laporan evaluasi untuk filter ini.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    {{-- ── Footer ── --}}
    <div class="report-footer">
        {{ $report['institution'] }} &mdash; Sistem Evaluasi Pembelajaran Madrasah &mdash; {{ \Carbon\Carbon::now()->translatedFormat('d F Y') }}
    </div>
</body>
</html>
