import EvaluationPeriodForm from '@/Components/EvaluationPeriods/EvaluationPeriodForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const formatDateInput = (value) => {
    if (!value) {
        return '';
    }

    return String(value).slice(0, 10);
};

export default function Edit({
    evaluationPeriod,
    academicYears,
    semesters,
}) {
    const { data, setData, put, processing, errors } = useForm({
        nama: evaluationPeriod.nama,
        academic_year_id: evaluationPeriod.academic_year_id,
        semester_id: evaluationPeriod.semester_id,
        start_date: formatDateInput(evaluationPeriod.start_date),
        end_date: formatDateInput(evaluationPeriod.end_date),
        is_active: evaluationPeriod.is_active,
        is_locked: evaluationPeriod.is_locked,
        is_anonymous: evaluationPeriod.is_anonymous,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('evaluation-periods.update', evaluationPeriod.id));
    };

    return (
        <AdminLayout title="Ubah Periode Evaluasi">
            <Head title="Ubah Periode Evaluasi" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui pengaturan periode evaluasi yang sudah ada.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <EvaluationPeriodForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        academicYears={academicYears}
                        semesters={semesters}
                        submitLabel="Perbarui"
                        cancelHref={route('evaluation-periods.index')}
                        onSubmit={submit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
