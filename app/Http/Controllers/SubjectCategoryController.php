<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubjectCategoryRequest;
use App\Http\Requests\UpdateSubjectCategoryRequest;
use App\Models\SubjectCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubjectCategoryController extends Controller
{
    /**
     * Display a listing of subject categories.
     */
    public function index(Request $request): Response
    {
        $subjectCategories = SubjectCategory::query()
            ->withCount('subjects')
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where('nama', 'like', '%'.$request->string('search').'%'),
            )
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SubjectCategories/Index', [
            'subjectCategories' => $subjectCategories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new subject category.
     */
    public function create(): Response
    {
        return Inertia::render('SubjectCategories/Create');
    }

    /**
     * Store a newly created subject category.
     */
    public function store(StoreSubjectCategoryRequest $request): RedirectResponse
    {
        SubjectCategory::create($request->validated());

        return redirect()
            ->route('subject-categories.index')
            ->with('success', 'Kategori mata pelajaran berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified subject category.
     */
    public function edit(SubjectCategory $subjectCategory): Response
    {
        return Inertia::render('SubjectCategories/Edit', [
            'subjectCategory' => $subjectCategory,
        ]);
    }

    /**
     * Update the specified subject category.
     */
    public function update(UpdateSubjectCategoryRequest $request, SubjectCategory $subjectCategory): RedirectResponse
    {
        $subjectCategory->update($request->validated());

        return redirect()
            ->route('subject-categories.index')
            ->with('success', 'Kategori mata pelajaran berhasil diperbarui.');
    }

    /**
     * Remove the specified subject category.
     */
    public function destroy(SubjectCategory $subjectCategory): RedirectResponse
    {
        if ($subjectCategory->subjects()->exists()) {
            return redirect()
                ->route('subject-categories.index')
                ->with('error', 'Kategori mata pelajaran tidak dapat dihapus karena masih memiliki mata pelajaran.');
        }

        $subjectCategory->delete();

        return redirect()
            ->route('subject-categories.index')
            ->with('success', 'Kategori mata pelajaran berhasil dihapus.');
    }
}
