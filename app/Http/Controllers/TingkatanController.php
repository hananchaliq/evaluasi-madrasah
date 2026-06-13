<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTingkatanRequest;
use App\Http\Requests\UpdateTingkatanRequest;
use App\Models\Tingkatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TingkatanController extends Controller
{
    /**
     * Display a listing of tingkatans.
     */
    public function index(Request $request): Response
    {
        $tingkatans = Tingkatan::query()
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where('nama', 'like', '%'.$request->string('search').'%'),
            )
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tingkatans/Index', [
            'tingkatans' => $tingkatans,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new tingkatan.
     */
    public function create(): Response
    {
        return Inertia::render('Tingkatans/Create');
    }

    /**
     * Store a newly created tingkatan.
     */
    public function store(StoreTingkatanRequest $request): RedirectResponse
    {
        Tingkatan::create($request->validated());

        return redirect()
            ->route('tingkatans.index')
            ->with('success', 'Tingkatan berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified tingkatan.
     */
    public function edit(Tingkatan $tingkatan): Response
    {
        return Inertia::render('Tingkatans/Edit', [
            'tingkatan' => $tingkatan,
        ]);
    }

    /**
     * Update the specified tingkatan.
     */
    public function update(UpdateTingkatanRequest $request, Tingkatan $tingkatan): RedirectResponse
    {
        $tingkatan->update($request->validated());

        return redirect()
            ->route('tingkatans.index')
            ->with('success', 'Tingkatan berhasil diperbarui.');
    }

    /**
     * Remove the specified tingkatan.
     */
    public function destroy(Tingkatan $tingkatan): RedirectResponse
    {
        $tingkatan->delete();

        return redirect()
            ->route('tingkatans.index')
            ->with('success', 'Tingkatan berhasil dihapus.');
    }
}
