<?php

namespace App\Http\Controllers;

use App\Http\Requests\SelectEvaluationStudentRequest;
use App\Http\Requests\UpdateStudentEvaluationRequest;
use App\Models\Evaluation;
use App\Models\Student;
use App\Models\Teacher;
use App\Services\NotificationService;
use App\Services\StudentEvaluationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentEvaluationController extends Controller
{
    public function __construct(
        private readonly StudentEvaluationService $studentEvaluationService,
        private readonly NotificationService $notificationService,
    ) {}

    /**
     * Display teachers available for evaluation.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $student = $this->studentEvaluationService->resolveStudent(
            $user,
            $request->session()->get('evaluation_student_id'),
        );

        $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();
        $requiresStudentSelection = ! $this->studentEvaluationService->hasLinkedStudent($user);

        $studentPayload = null;
        $teacherSummaries = [];
        $warnings = [];

        if ($student) {
            $student->load(['kelas.tingkatan:id,nama']);

            $studentPayload = [
                'id' => $student->id,
                'nama' => $student->nama,
                'nis' => $student->nis,
                'kelas' => $student->kelas ? [
                    'id' => $student->kelas->id,
                    'nama' => $student->kelas->nama,
                    'tingkatan' => $student->kelas->tingkatan?->nama,
                ] : null,
            ];

            if (! $student->kelas_id) {
                $warnings[] = 'Siswa belum memiliki kelas sehingga belum ada guru yang dapat dievaluasi.';
            }
        }

        if ($student && $activePeriod && $student->kelas_id) {
            $assignments = $this->studentEvaluationService->getTeachingAssignments(
                $student,
                $activePeriod,
            );

            $teacherSummaries = $this->studentEvaluationService->buildTeacherSummaries(
                $student,
                $activePeriod,
                $assignments,
            );

            if ($assignments->isEmpty()) {
                $warnings[] = 'Belum ada penugasan mengajar untuk kelas siswa pada periode evaluasi aktif.';
            }
        }

        if (! $activePeriod) {
            $warnings[] = 'Tidak ada periode evaluasi aktif saat ini.';
        }

        return Inertia::render('StudentEvaluations/Index', [
            'student' => $studentPayload,
            'requiresStudentSelection' => $requiresStudentSelection && ! $student,
            'students' => $requiresStudentSelection
                ? Student::query()
                    ->with([
                        'kelas:id,nama,tingkatan_id',
                        'kelas.tingkatan:id,nama',
                    ])
                    ->orderBy('nama')
                    ->get(['id', 'nama', 'nis', 'kelas_id'])
                : [],
            'activePeriod' => $activePeriod ? [
                'id' => $activePeriod->id,
                'nama' => $activePeriod->nama,
                'start_date' => $activePeriod->start_date,
                'end_date' => $activePeriod->end_date,
                'is_locked' => $activePeriod->is_locked,
                'is_anonymous' => $activePeriod->is_anonymous,
                'academic_year' => $activePeriod->academicYear?->only(['id', 'nama']),
                'semester' => $activePeriod->semester?->only(['id', 'nama']),
            ] : null,
            'teachers' => $teacherSummaries,
            'warnings' => $warnings,
        ]);
    }

    /**
     * Store the selected student context for admin testing.
     */
    public function selectStudent(SelectEvaluationStudentRequest $request): RedirectResponse
    {
        if ($this->studentEvaluationService->hasLinkedStudent($request->user())) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Akun ini sudah terhubung dengan profil siswa.');
        }

        $request->session()->put(
            'evaluation_student_id',
            $request->integer('student_id'),
        );

        return redirect()
            ->route('student-evaluations.index')
            ->with('success', 'Profil siswa berhasil dipilih.');
    }

    /**
     * Show the evaluation form for a teacher.
     */
    public function show(Request $request, Teacher $teacher): Response|RedirectResponse
    {
        $student = $this->resolveStudentOrRedirect($request);

        if ($student instanceof RedirectResponse) {
            return $student;
        }

        $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();

        if (! $activePeriod) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Tidak ada periode evaluasi aktif saat ini.');
        }

        if (! $this->studentEvaluationService->isTeacherAssigned($student, $teacher, $activePeriod)) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Guru tidak terdaftar sebagai pengajar siswa pada periode ini.');
        }

        $existingEvaluation = Evaluation::query()
            ->where('student_id', $student->id)
            ->where('teacher_id', $teacher->id)
            ->where('evaluation_period_id', $activePeriod->id)
            ->first();

        if (! $existingEvaluation && $activePeriod->is_locked) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Periode evaluasi terkunci dan tidak menerima pengisian baru.');
        }

        $evaluation = $existingEvaluation
            ?? $this->studentEvaluationService->findOrCreateDraft(
                $student,
                $teacher,
                $activePeriod,
            );

        $evaluation->load([
            'evaluationAnswers:id,evaluation_id,question_id,score',
        ]);

        $assignments = $this->studentEvaluationService->getTeachingAssignments(
            $student,
            $activePeriod,
        )->where('teacher_id', $teacher->id);

        $questions = $this->studentEvaluationService->getActiveQuestions();

        if ($questions->isEmpty()) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Belum ada pertanyaan evaluasi aktif.');
        }

        $answers = $evaluation->evaluationAnswers
            ->mapWithKeys(fn ($answer) => [$answer->question_id => $answer->score])
            ->all();

        return Inertia::render('StudentEvaluations/Form', [
            'student' => [
                'id' => $student->id,
                'nama' => $student->nama,
                'nis' => $student->nis,
            ],
            'teacher' => $teacher->only(['id', 'nama']),
            'subjects' => $assignments
                ->pluck('subject.nama')
                ->filter()
                ->unique()
                ->values()
                ->all(),
            'activePeriod' => [
                'id' => $activePeriod->id,
                'nama' => $activePeriod->nama,
                'is_locked' => $activePeriod->is_locked,
                'start_date' => $activePeriod->start_date,
                'end_date' => $activePeriod->end_date,
            ],
            'evaluation' => [
                'id' => $evaluation->id,
                'status' => $evaluation->status,
                'average_score' => $evaluation->average_score,
                'submitted_at' => $evaluation->submitted_at,
            ],
            'questions' => $questions,
            'answers' => $answers,
            'isReadOnly' => $evaluation->status === Evaluation::STATUS_SUBMITTED
                || $activePeriod->is_locked,
        ]);
    }

    /**
     * Save draft answers or submit the evaluation.
     */
    public function update(
        UpdateStudentEvaluationRequest $request,
        Evaluation $evaluation,
    ): RedirectResponse {
        $student = $this->resolveStudentOrRedirect($request);

        if ($student instanceof RedirectResponse) {
            return $student;
        }

        $this->studentEvaluationService->authorizeEvaluation($evaluation, $student);

        $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();

        if (! $activePeriod || $activePeriod->id !== $evaluation->evaluation_period_id) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Periode evaluasi tidak valid.');
        }

        $this->studentEvaluationService->saveEvaluation(
            $evaluation,
            $request->validated('answers', []),
            $request->boolean('submit'),
            $activePeriod,
        );

        if ($request->boolean('submit')) {
            $this->notificationService->syncNotifications();

            return redirect()
                ->route('student-evaluations.index')
                ->with('success', 'Evaluasi guru berhasil dikirim.');
        }

        return redirect()
            ->route('student-evaluations.teachers.show', $evaluation->teacher_id)
            ->with('success', 'Draft evaluasi berhasil disimpan.');
    }

    /**
     * Resolve the current student or redirect when missing.
     */
    private function resolveStudentOrRedirect(Request $request): Student|RedirectResponse
    {
        $student = $this->studentEvaluationService->resolveStudent(
            $request->user(),
            $request->session()->get('evaluation_student_id'),
        );

        if (! $student) {
            return redirect()
                ->route('student-evaluations.index')
                ->with('error', 'Pilih profil siswa terlebih dahulu.');
        }

        return $student;
    }
}
