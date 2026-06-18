import EvaluationPeriodForm from '@/Components/EvaluationPeriods/EvaluationPeriodForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ academicYears, semesters }) {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        academic_year_id: '',
        semester_id: '',
        start_date: '',
        end_date: '',
        is_active: false,
        is_locked: false,
        is_anonymous: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('evaluation-periods.store'));
    };

    return (
        <AdminLayout title="Tambah Periode Evaluasi">
            <Head title="Tambah Periode Evaluasi" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Buat periode evaluasi baru untuk tahun akademik dan
                        semester tertentu.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {academicYears.length === 0 ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            Belum ada tahun akademik. Silakan{' '}
                            <Link
                                href={route('academic-years.create')}
                                className="font-semibold underline"
                            >
                                tambah tahun akademik
                            </Link>{' '}
                            terlebih dahulu.
                        </div>
                    ) : semesters.length === 0 ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            Belum ada semester. Silakan{' '}
                            <Link
                                href={route('semesters.create')}
                                className="font-semibold underline"
                            >
                                tambah semester
                            </Link>{' '}
                            terlebih dahulu.
                        </div>
                    ) : (
                        <EvaluationPeriodForm
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            academicYears={academicYears}
                            semesters={semesters}
                            submitLabel="Simpan"
                            cancelHref={route('evaluation-periods.index')}
                            onSubmit={submit}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
