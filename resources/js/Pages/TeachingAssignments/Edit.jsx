import TeachingAssignmentForm from '@/Components/TeachingAssignments/TeachingAssignmentForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({
    assignment,
    teachers,
    subjects,
    kelasList,
    academicYears,
    semesters,
}) {
    const { data, setData, put, processing, errors } = useForm({
        teacher_id: assignment.teacher_id,
        subject_id: assignment.subject_id,
        kelas_id: assignment.kelas_id,
        academic_year_id: assignment.academic_year_id,
        semester_id: assignment.semester_id,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('teaching-assignments.update', assignment.id));
    };

    return (
        <AdminLayout title="Ubah Penugasan Mengajar">
            <Head title="Ubah Penugasan Mengajar" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Perbarui penugasan mengajar yang sudah ada.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <TeachingAssignmentForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        teachers={teachers}
                        subjects={subjects}
                        kelasList={kelasList}
                        academicYears={academicYears}
                        semesters={semesters}
                        submitLabel="Perbarui"
                        cancelHref={route('teaching-assignments.index')}
                        onSubmit={submit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
