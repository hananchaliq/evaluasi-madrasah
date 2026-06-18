<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateEvaluationRequest; // <--- IMPORT REQUEST BARU DI SINI
use App\Models\Evaluation;
use App\Models\Teacher;
use App\Services\NotificationService;
use App\Services\StudentEvaluationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
   public function __construct(
      private readonly StudentEvaluationService $studentEvaluationService,
      private readonly NotificationService $notificationService,
   ) {
   }

   /**
    * Show the evaluation form for a teacher.
    */
   public function create(Request $request, Teacher $teacher): Response|RedirectResponse
   {
      $student = $this->studentEvaluationService->resolveStudent($request->user());

      if (!$student) {
         abort(403, 'Profil siswa tidak ditemukan.');
      }

      $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();

      if (!$activePeriod) {
         return redirect()
            ->route('student.dashboard')
            ->with('error', 'Tidak ada periode evaluasi aktif saat ini.');
      }

      if (!$this->studentEvaluationService->isTeacherAssigned($student, $teacher, $activePeriod)) {
         return redirect()
            ->route('student.dashboard')
            ->with('error', 'Guru tidak terdaftar sebagai pengajar Anda pada periode ini.');
      }

      $existingEvaluation = Evaluation::query()
         ->where('student_id', $student->id)
         ->where('teacher_id', $teacher->id)
         ->where('evaluation_period_id', $activePeriod->id)
         ->first();

      if (!$existingEvaluation && $activePeriod->is_locked) {
         return redirect()
            ->route('student.dashboard')
            ->with('error', 'Periode evaluasi terkunci.');
      }

      $evaluation = $existingEvaluation
         ?? $this->studentEvaluationService->findOrCreateDraft($student, $teacher, $activePeriod);

      $evaluation->load(['evaluationAnswers:id,evaluation_id,question_id,score']);

      $assignments = $this->studentEvaluationService->getTeachingAssignments($student, $activePeriod)
         ->where('teacher_id', $teacher->id);

      $questions = $this->studentEvaluationService->getActiveQuestions();

      if ($questions->isEmpty()) {
         return redirect()
            ->route('student.dashboard')
            ->with('error', 'Belum ada pertanyaan evaluasi aktif.');
      }

      $answers = $evaluation->evaluationAnswers
         ->mapWithKeys(fn($answer) => [$answer->question_id => $answer->score])
         ->all();

      return Inertia::render('Student/EvaluationForm', [
         'teacher' => $teacher->only(['id', 'nama']),
         'subjects' => $assignments->pluck('subject.nama')->unique()->values()->all(),
         'activePeriod' => $activePeriod,
         'evaluation' => $evaluation,
         'questions' => $questions,
         'answers' => $answers,
         'isReadOnly' => $evaluation->status === Evaluation::STATUS_SUBMITTED || $activePeriod->is_locked,
      ]);
   }

   /**
    * Save draft or submit evaluation (Teacher-based entry).
    */
   public function store(UpdateEvaluationRequest $request, Teacher $teacher): RedirectResponse
   {
      $student = $this->studentEvaluationService->resolveStudent($request->user());

      if (!$student) {
         abort(403);
      }

      $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();

      if (!$activePeriod) {
         return redirect()
            ->route('student.dashboard')
            ->with('error', 'Tidak ada periode evaluasi aktif.');
      }

      $evaluation = $this->studentEvaluationService->findOrCreateDraft($student, $teacher, $activePeriod);

      return $this->processSave($request, $evaluation, $activePeriod);
   }

   /**
    * Update an existing evaluation.
    */
   public function update(UpdateEvaluationRequest $request, Evaluation $evaluation): RedirectResponse
   {
      $student = $this->studentEvaluationService->resolveStudent($request->user());

      if (!$student) {
         abort(403);
      }

      $this->studentEvaluationService->authorizeEvaluation($evaluation, $student);

      $activePeriod = $this->studentEvaluationService->getActiveEvaluationPeriod();

      if (!$activePeriod || $activePeriod->id !== $evaluation->evaluation_period_id) {
         return redirect()
            ->route('student.dashboard')
            ->with('error', 'Periode evaluasi tidak valid atau telah berakhir.');
      }

      return $this->processSave($request, $evaluation, $activePeriod);
   }

   /**
    * Process the actual saving/submitting logic.
    */
   private function processSave(UpdateEvaluationRequest $request, Evaluation $evaluation, $activePeriod): RedirectResponse
   {
      // Ambil data yang sudah lolos uji validasi kebersihan data
      $validated = $request->validated();

      $this->studentEvaluationService->saveEvaluation(
         $evaluation,
         $validated['answers'],
         $request->boolean('submit'),
         $activePeriod
      );

      if ($request->boolean('submit')) {
         $this->notificationService->syncNotifications();

         return redirect()
            ->route('student.dashboard')
            ->with('success', 'Evaluasi guru berhasil dikirim.');
      }

      return redirect()
         ->route('student.evaluations.create', $evaluation->teacher_id)
         ->with('success', 'Draft evaluasi berhasil disimpan.');
   }
}