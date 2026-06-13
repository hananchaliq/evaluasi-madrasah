import StudentMonitoringFilters from '@/Components/StudentMonitoring/StudentMonitoringFilters';
import StudentMonitoringSummary from '@/Components/StudentMonitoring/StudentMonitoringSummary';
import StudentMonitoringTable from '@/Components/StudentMonitoring/StudentMonitoringTable';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index({
    filters,
    search,
    statusFilter,
    summary,
    students,
    academicYears,
    semesters,
    kelasList,
    statusOptions,
    warnings,
}) {
    return (
        <AdminLayout title="Pemantauan Siswa">
            <Head title="Pemantauan Siswa" />

            <div className="space-y-6">
                <div>
                    <p className="text-sm text-slate-600">
                        Pantau progres evaluasi siswa, evaluasi terkirim,
                        evaluasi pending, dan persentase penyelesaian.
                    </p>
                </div>

                <StudentMonitoringFilters
                    academicYears={academicYears}
                    semesters={semesters}
                    kelasList={kelasList}
                    filters={filters}
                    search={search}
                    statusFilter={statusFilter}
                    statusOptions={statusOptions}
                />

                {warnings.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <ul className="list-disc space-y-1 ps-5">
                            {warnings.map((warning) => (
                                <li key={warning}>{warning}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <StudentMonitoringSummary summary={summary} />

                <StudentMonitoringTable students={students} />
            </div>
        </AdminLayout>
    );
}
