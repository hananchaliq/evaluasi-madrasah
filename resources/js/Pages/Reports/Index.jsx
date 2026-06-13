import { AnalyticsSummaryCards } from '@/Components/Analytics/AnalyticsRankings';
import ReportActions from '@/Components/Reports/ReportActions';
import ReportEvaluationPeriodTable from '@/Components/Reports/ReportEvaluationPeriodTable';
import ReportFilters from '@/Components/Reports/ReportFilters';
import ReportPrintHeader from '@/Components/Reports/ReportPrintHeader';
import ReportStatisticsTable from '@/Components/Reports/ReportStatisticsTable';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index({
    report,
    reportType,
    filters,
    search,
    groupBy,
    summary,
    statistics,
    filterLabels,
    academicYears,
    semesters,
    teachers,
    kelasList,
    subjects,
    subjectCategories,
    evaluationPeriods = [],
}) {
    const isEvaluationPeriodReport = reportType === 'evaluation_period';

    return (
        <AdminLayout title={report.title}>
            <Head title={report.title} />

            <div className="report-page space-y-6">
                <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-600">
                            {report.description}
                        </p>
                    </div>
                    <ReportActions />
                </div>

                <ReportFilters
                    report={report}
                    reportType={reportType}
                    academicYears={academicYears}
                    semesters={semesters}
                    teachers={teachers}
                    kelasList={kelasList}
                    subjects={subjects}
                    subjectCategories={subjectCategories}
                    evaluationPeriods={evaluationPeriods}
                    filters={filters}
                    search={search}
                />

                <ReportPrintHeader
                    report={report}
                    filterLabels={filterLabels}
                />

                <AnalyticsSummaryCards summary={summary} />

                {isEvaluationPeriodReport ? (
                    <ReportEvaluationPeriodTable statistics={statistics} />
                ) : (
                    <ReportStatisticsTable
                        statistics={statistics}
                        groupBy={groupBy}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
