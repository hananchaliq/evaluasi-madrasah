<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectRequest;
use App\Http\Requests\UpdateSubjectRequest;
use App\Models\Subject;
use App\Models\SubjectCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    /**
     * Display a listing of subjects.
     */
    public function index(Request $request): Response
    {
        $subjects = Subject::query()
            ->with('subjectCategory:id,nama')
            ->withCount('teachingAssignments')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(function ($builder) use ($request) {
                    $builder->where('nama', 'like', '%'.$request->string('search').'%')
                        ->orWhereHas('subjectCategory', fn ($categoryQuery) => $categoryQuery->where('nama', 'like', '%'.$request->string('search').'%'));
                }),
            )
            ->when(
                $request->filled('subject_category_id'),
                fn ($query) => $query->where('subject_category_id', $request->integer('subject_category_id')),
            )
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Subjects/Index', [
            'subjects' => $subjects,
            'subjectCategories' => SubjectCategory::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
            'filters' => $request->only(['search', 'subject_category_id']),
        ]);
    }

    /**
     * Show the form for creating a new subject.
     */
    public function create(): Response
    {
        return Inertia::render('Subjects/Create', [
            'subjectCategories' => SubjectCategory::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
        ]);
    }

    /**
     * Store a newly created subject.
     */
    public function store(StoreSubjectRequest $request): RedirectResponse
    {
        Subject::create($request->validated());

        return redirect()
            ->route('subjects.index')
            ->with('success', 'Mata pelajaran berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified subject.
     */
    public function edit(Subject $subject): Response
    {
        return Inertia::render('Subjects/Edit', [
            'subject' => $subject->load('subjectCategory:id,nama'),
            'subjectCategories' => SubjectCategory::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
        ]);
    }

    /**
     * Update the specified subject.
     */
    public function update(UpdateSubjectRequest $request, Subject $subject): RedirectResponse
    {
        $subject->update($request->validated());

        return redirect()
            ->route('subjects.index')
            ->with('success', 'Mata pelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified subject.
     */
    public function destroy(Subject $subject): RedirectResponse
    {
        if ($subject->teachingAssignments()->exists()) {
            return redirect()
                ->route('subjects.index')
                ->with('error', 'Mata pelajaran tidak dapat dihapus karena masih digunakan pada penugasan mengajar.');
        }

        $subject->delete();

        return redirect()
            ->route('subjects.index')
            ->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}
