<?php

namespace App\Services;

use App\Models\Evaluation;
use App\Models\EvaluationPeriod;
use App\Models\Question;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TeachingAssignment;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use RuntimeException;

class StudentEvaluationService
{
    /**
     * Resolve the student profile for the current authenticated user.
     */
    public function resolveStudent(User $user): ?Student
    {
        return Student::query()
            ->where('user_id', $user->id)
            ->first();
    }

    /**
     * Determine whether the authenticated user has a linked student profile.
     */
    public function hasLinkedStudent(User $user): bool
    {
        return Student::query()
            ->where('user_id', $user->id)
            ->exists();
    }

    /**
     * Get the currently active evaluation period.
     */
    public function getActiveEvaluationPeriod(): ?EvaluationPeriod
    {
        return EvaluationPeriod::query()
            ->with([
                'academicYear:id,nama',
                'semester:id,nama,academic_year_id',
            ])
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get teaching assignments for a student within an evaluation period.
     *
     * @return EloquentCollection<int, TeachingAssignment>
     */
    public function getTeachingAssignments(
        Student $student,
        EvaluationPeriod $period,
    ): EloquentCollection {
        if (! $student->kelas_id) {
            return new EloquentCollection;
        }

        return TeachingAssignment::query()
            ->with([
                'teacher:id,nama',
                'subject:id,nama',
            ])
            ->where('kelas_id', $student->kelas_id)
            ->where('academic_year_id', $period->academic_year_id)
            ->where('semester_id', $period->semester_id)
            ->orderBy('teacher_id')
            ->get();
    }

    /**
     * Build teacher evaluation summaries for the index page.
     *
     * @return array<int, array<string, mixed>>
     */
    public function buildTeacherSummaries(
        Student $student,
        EvaluationPeriod $period,
        EloquentCollection $assignments,
    ): array {
        $evaluations = Evaluation::query()
            ->where('student_id', $student->id)
            ->where('evaluation_period_id', $period->id)
            ->get()
            ->keyBy('teacher_id');

        return $assignments
            ->groupBy('teacher_id')
            ->map(function (Collection $teacherAssignments) use ($evaluations) {
                $teacher = $teacherAssignments->first()->teacher;
                $evaluation = $evaluations->get($teacher->id);

                return [
                    'teacher' => [
                        'id' => $teacher->id,
                        'nama' => $teacher->nama,
                    ],
                    'subjects' => $teacherAssignments
                        ->pluck('subject.nama')
                        ->filter()
                        ->unique()
                        ->values()
                        ->all(),
                    'evaluation' => $evaluation ? [
                        'id' => $evaluation->id,
                        'status' => $evaluation->status,
                        'average_score' => $evaluation->average_score,
                        'submitted_at' => $evaluation->submitted_at,
                    ] : null,
                    'status' => $this->resolveEvaluationStatus($evaluation),
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Check whether a teacher is assigned to the student for the given period.
     */
    public function isTeacherAssigned(
        Student $student,
        Teacher $teacher,
        EvaluationPeriod $period,
    ): bool {
        if (! $student->kelas_id) {
            return false;
        }

        return TeachingAssignment::query()
            ->where('teacher_id', $teacher->id)
            ->where('kelas_id', $student->kelas_id)
            ->where('academic_year_id', $period->academic_year_id)
            ->where('semester_id', $period->semester_id)
            ->exists();
    }

    /**
     * Find an existing evaluation or create a draft when allowed.
     */
    public function findOrCreateDraft(
        Student $student,
        Teacher $teacher,
        EvaluationPeriod $period,
    ): Evaluation {
        $evaluation = Evaluation::query()
            ->where('student_id', $student->id)
            ->where('teacher_id', $teacher->id)
            ->where('evaluation_period_id', $period->id)
            ->first();

        if ($evaluation) {
            return $evaluation;
        }

        if ($period->is_locked) {
            throw ValidationException::withMessages([
                'period' => 'Periode evaluasi terkunci dan tidak menerima pengisian baru.',
            ]);
        }

        return Evaluation::create([
            'student_id' => $student->id,
            'teacher_id' => $teacher->id,
            'evaluation_period_id' => $period->id,
            'academic_year_id' => $period->academic_year_id,
            'semester_id' => $period->semester_id,
            'status' => Evaluation::STATUS_DRAFT,
        ]);
    }

    /**
     * Get active evaluation questions ordered for display.
     *
     * @return EloquentCollection<int, Question>
     */
    public function getActiveQuestions(): EloquentCollection
    {
        return Question::query()
            ->where('is_active', true)
            ->orderBy('urutan')
            ->orderBy('id')
            ->get(['id', 'pertanyaan', 'urutan']);
    }

    /**
     * Persist draft answers or submit the evaluation.
     *
     * @param  array<int, array{question_id:int, score:int|null}>  $answers
     */
    public function saveEvaluation(
        Evaluation $evaluation,
        array $answers,
        bool $submit,
        EvaluationPeriod $period,
    ): Evaluation {
        if ($evaluation->status === Evaluation::STATUS_SUBMITTED) {
            throw ValidationException::withMessages([
                'evaluation' => 'Evaluasi sudah dikirim dan tidak dapat diubah.',
            ]);
        }

        if ($period->is_locked) {
            throw ValidationException::withMessages([
                'period' => 'Periode evaluasi terkunci dan tidak dapat menerima perubahan.',
            ]);
        }

        $activeQuestionIds = $this->getActiveQuestions()->pluck('id');

        DB::transaction(function () use ($evaluation, $answers, $submit, $activeQuestionIds) {
            foreach ($answers as $answer) {
                $questionId = (int) $answer['question_id'];
                $score = $answer['score'] ?? null;

                if (! $activeQuestionIds->contains($questionId)) {
                    continue;
                }

                if ($score === null || $score === '') {
                    $evaluation->evaluationAnswers()
                        ->where('question_id', $questionId)
                        ->delete();

                    continue;
                }

                $evaluation->evaluationAnswers()->updateOrCreate(
                    ['question_id' => $questionId],
                    ['score' => (int) $score],
                );
            }

            if ($submit) {
                $answeredCount = $evaluation->evaluationAnswers()
                    ->whereIn('question_id', $activeQuestionIds)
                    ->count();

                if ($answeredCount !== $activeQuestionIds->count()) {
                    throw ValidationException::withMessages([
                        'answers' => 'Semua pertanyaan aktif wajib dijawab sebelum dikirim.',
                    ]);
                }

                $averageScore = $evaluation->evaluationAnswers()->avg('score');

                $evaluation->update([
                    'status' => Evaluation::STATUS_SUBMITTED,
                    'average_score' => round((float) $averageScore, 2),
                    'submitted_at' => now(),
                ]);
            } else {
                $evaluation->update([
                    'status' => Evaluation::STATUS_DRAFT,
                ]);
            }
        });

        return $evaluation->fresh([
            'teacher:id,nama',
            'evaluationAnswers',
        ]);
    }

    /**
     * Ensure the evaluation belongs to the resolved student.
     */
    public function authorizeEvaluation(Evaluation $evaluation, Student $student): void
    {
        if ($evaluation->student_id !== $student->id) {
            throw new RuntimeException('Evaluasi tidak valid untuk siswa ini.');
        }
    }

    private function resolveEvaluationStatus(?Evaluation $evaluation): string
    {
        if (! $evaluation) {
            return 'pending';
        }

        if ($evaluation->status === Evaluation::STATUS_SUBMITTED) {
            return 'submitted';
        }

        return 'draft';
    }
}
