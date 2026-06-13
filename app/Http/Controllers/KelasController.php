<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreKelasRequest;
use App\Http\Requests\UpdateKelasRequest;
use App\Models\Kelas;
use App\Models\Tingkatan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KelasController extends Controller
{
    /**
     * Display a listing of kelas.
     */
    public function index(Request $request): Response
    {
        $kelas = Kelas::query()
            ->with('tingkatan:id,nama')
            ->withCount(['students', 'teachingAssignments'])
            ->when(
                $request->filled('search'),
                fn ($query) => $query->where(function ($builder) use ($request) {
                    $builder->where('nama', 'like', '%'.$request->string('search').'%')
                        ->orWhereHas('tingkatan', fn ($tingkatanQuery) => $tingkatanQuery->where('nama', 'like', '%'.$request->string('search').'%'));
                }),
            )
            ->when(
                $request->filled('tingkatan_id'),
                fn ($query) => $query->where('tingkatan_id', $request->integer('tingkatan_id')),
            )
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Kelas/Index', [
            'kelas' => $kelas,
            'tingkatans' => Tingkatan::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
            'filters' => $request->only(['search', 'tingkatan_id']),
        ]);
    }

    /**
     * Show the form for creating a new kelas.
     */
    public function create(): Response
    {
        return Inertia::render('Kelas/Create', [
            'tingkatans' => Tingkatan::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
        ]);
    }

    /**
     * Store a newly created kelas.
     */
    public function store(StoreKelasRequest $request): RedirectResponse
    {
        Kelas::create($request->validated());

        return redirect()
            ->route('kelas.index')
            ->with('success', 'Kelas berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified kelas.
     */
    public function edit(Kelas $kela): Response
    {
        return Inertia::render('Kelas/Edit', [
            'kelasItem' => $kela->load('tingkatan:id,nama'),
            'tingkatans' => Tingkatan::query()
                ->orderBy('nama')
                ->get(['id', 'nama']),
        ]);
    }

    /**
     * Update the specified kelas.
     */
    public function update(UpdateKelasRequest $request, Kelas $kela): RedirectResponse
    {
        $kela->update($request->validated());

        return redirect()
            ->route('kelas.index')
            ->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified kelas.
     */
    public function destroy(Kelas $kela): RedirectResponse
    {
        if ($kela->students()->exists() || $kela->teachingAssignments()->exists()) {
            return redirect()
                ->route('kelas.index')
                ->with('error', 'Kelas tidak dapat dihapus karena masih memiliki data terkait.');
        }

        $kela->delete();

        return redirect()
            ->route('kelas.index')
            ->with('success', 'Kelas berhasil dihapus.');
    }
}
