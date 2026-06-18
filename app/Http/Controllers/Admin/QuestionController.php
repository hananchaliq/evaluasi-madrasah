<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Http\Requests\BulkQuestionRequest;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\Question;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QuestionController extends Controller
{
    /**
     * Display a listing of evaluation questions.
     */
    public function index(Request $request): Response
    {
        $questions = Question::query()
            ->withCount('evaluationAnswers')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(
                    'pertanyaan',
                    'like',
                    '%'.$request->string('search').'%',
                ),
            )
            ->when(
                $request->filled('is_active') && $request->string('is_active') !== '',
                fn ($query) => $query->where(
                    'is_active',
                    $request->string('is_active') === '1',
                ),
            )
            ->orderBy('urutan')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions,
            'filters' => $request->only(['search', 'is_active']),
            'nextUrutan' => (int) Question::query()->max('urutan') + 1,
        ]);
    }

    /**
     * Show the form for creating a new question.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Questions/Create', [
            'nextUrutan' => (int) Question::query()->max('urutan') + 1,
        ]);
    }

    /**
     * Store a newly created question.
     */
    public function store(StoreQuestionRequest $request): RedirectResponse
    {
        Question::create($request->validated());

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'Pertanyaan evaluasi berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified question.
     */
    public function edit(Question $question): Response
    {
        return Inertia::render('Admin/Questions/Edit', [
            'question' => $question,
        ]);
    }

    /**
     * Update the specified question.
     */
    public function update(UpdateQuestionRequest $request, Question $question): RedirectResponse
    {
        $question->update($request->validated());

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'Pertanyaan evaluasi berhasil diperbarui.');
    }

    /**
     * Remove the specified question.
     */
    public function destroy(Question $question): RedirectResponse
    {
        if ($question->evaluationAnswers()->exists()) {
            return redirect()
                ->route('admin.questions.index')
                ->with('error', 'Pertanyaan tidak dapat dihapus karena sudah digunakan dalam evaluasi.');
        }

        $question->delete();

        return redirect()
            ->route('admin.questions.index')
            ->with('success', 'Pertanyaan evaluasi berhasil dihapus.');
    }

    /**
     * Apply bulk actions to selected questions.
     */
    public function bulkUpdate(BulkQuestionRequest $request): RedirectResponse
    {
        $questions = Question::query()
            ->whereIn('id', $request->validated('ids'))
            ->get();

        $action = $request->validated('action');

        if ($action === 'activate') {
            Question::query()
                ->whereIn('id', $questions->pluck('id'))
                ->update(['is_active' => true]);

            return redirect()
                ->route('admin.questions.index')
                ->with('success', $questions->count().' pertanyaan berhasil diaktifkan.');
        }

        if ($action === 'deactivate') {
            Question::query()
                ->whereIn('id', $questions->pluck('id'))
                ->update(['is_active' => false]);

            return redirect()
                ->route('admin.questions.index')
                ->with('success', $questions->count().' pertanyaan berhasil dinonaktifkan.');
        }

        $deletedCount = 0;
        $skippedCount = 0;

        foreach ($questions as $question) {
            if ($question->evaluationAnswers()->exists()) {
                $skippedCount++;

                continue;
            }

            $question->delete();
            $deletedCount++;
        }

        if ($deletedCount === 0 && $skippedCount > 0) {
            return redirect()
                ->route('admin.questions.index')
                ->with('error', 'Tidak ada pertanyaan yang dapat dihapus karena masih digunakan dalam evaluasi.');
        }

        $message = $deletedCount.' pertanyaan berhasil dihapus.';

        if ($skippedCount > 0) {
            $message .= ' '.$skippedCount.' pertanyaan dilewati karena masih digunakan.';
        }

        return redirect()
            ->route('admin.questions.index')
            ->with('success', $message);
    }

    /**
     * Move question order up or down.
     */
    public function move(Request $request, Question $question): RedirectResponse
    {
        $request->validate([
            'direction' => ['required', 'in:up,down'],
        ], [
            'direction.required' => 'Arah pemindahan wajib dipilih.',
            'direction.in' => 'Arah pemindahan tidak valid.',
        ]);

        $orderedIds = Question::query()
            ->orderBy('urutan')
            ->orderBy('id')
            ->pluck('id')
            ->all();

        $currentIndex = array_search($question->id, $orderedIds, true);

        if ($currentIndex === false) {
            return redirect()
                ->route('admin.questions.index')
                ->with('error', 'Pertanyaan tidak ditemukan.');
        }

        $targetIndex = $request->string('direction') === 'up'
            ? $currentIndex - 1
            : $currentIndex + 1;

        if ($targetIndex < 0 || $targetIndex >= count($orderedIds)) {
            return redirect()
                ->route('admin.questions.index')
                ->with('error', 'Pertanyaan sudah berada di posisi '.($request->string('direction') === 'up' ? 'teratas' : 'terbawah').'.');
        }

        [$orderedIds[$currentIndex], $orderedIds[$targetIndex]] = [
            $orderedIds[$targetIndex],
            $orderedIds[$currentIndex],
        ];

        DB::transaction(function () use ($orderedIds) {
            foreach ($orderedIds as $index => $id) {
                Question::query()
                    ->whereKey($id)
                    ->update(['urutan' => $index + 1]);
            }
        });

        return redirect()
            ->route('admin.questions.index', $request->only(['search', 'is_active', 'page']))
            ->with('success', 'Urutan pertanyaan berhasil diperbarui.');
    }
}
