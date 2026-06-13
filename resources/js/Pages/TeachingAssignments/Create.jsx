import TeachingAssignmentForm from '@/Components/TeachingAssignments/TeachingAssignmentForm';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({
    teachers,
    subjects,
    kelasList,
    academicYears,
    semesters,
    canCreate,
}) {
    const { data, setData, post, processing, errors } = useForm({
        teacher_id: '',
        subject_id: '',
        kelas_id: '',
        academic_year_id: '',
        semester_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('teaching-assignments.store'));
    };

    return (
        <AdminLayout title="Tambah Penugasan Mengajar">
            <Head title="Tambah Penugasan Mengajar" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <p className="text-sm text-slate-600">
                        Tetapkan guru untuk mengajar mata pelajaran pada kelas,
                        tahun akademik, dan semester tertentu.
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    {!canCreate ? (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                            Data master belum lengkap. Pastikan sudah ada data{' '}
                            <Link
                                href={route('teachers.index')}
                                className="font-semibold underline"
                            >
                                guru
                            </Link>
                            ,{' '}
                            <Link
                                href={route('subjects.index')}
                                className="font-semibold underline"
                            >
                                mata pelajaran
                            </Link>
                            , kelas,{' '}
                            <Link
                                href={route('academic-years.index')}
                                className="font-semibold underline"
                            >
                                tahun akademik
                            </Link>
                            , dan{' '}
                            <Link
                                href={route('semesters.index')}
                                className="font-semibold underline"
                            >
                                semester
                            </Link>
                            .
                        </div>
                    ) : (
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
                            submitLabel="Simpan"
                            cancelHref={route('teaching-assignments.index')}
                            onSubmit={submit}
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
