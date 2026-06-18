<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Maatwebsite\Excel\Facades\Excel;

class ImportController extends Controller
{
   public function show(string $type)
   {
      $map = [
         'teachers' => 'Admin/Teachers/Import',
         'students' => 'Admin/Students/Import',
         'evaluationresults' => 'Admin/EvaluationResults/Import',
         'subjects' => 'Admin/Subjects/Import',
         'kelas' => 'Admin/Kelas/Import',
      ];

      abort_unless(isset($map[$type]), 404);

      return inertia($map[$type], [
         'type' => $type,
      ]);
   }

   public function store(Request $request, string $type)
   {
      $request->validate([
         'file' => 'required|file|mimes:xlsx,xls,csv',
      ]);

      $map = config('imports');

      if (!isset($map[$type])) {
         return back()->withErrors([
            'file' => "Import type '{$type}' tidak ditemukan"
         ]);
      }

      try {
         $import = new $map[$type];

         Excel::import($import, $request->file('file'));

         $inserted = $import->inserted ?? 0;
         $skipped = $import->skipped ?? 0;

         if ($inserted === 0) {
            return back()->withErrors([
               'file' => 'Tidak ada data masuk (semua duplikat / file kosong)'
            ]);
         }

         return back()->with(
            'success',
            "Import {$type} selesai. Masuk: {$inserted}, dilewati: {$skipped}"
         );

      } catch (\Exception $e) {
         return back()->withErrors([
            'file' => 'Import gagal: ' . $e->getMessage()
         ]);
      }
   }

   public function downloadTemplate(string $type)
   {
      $templates = [
         'teachers' => ['nama', 'email', 'nip'],
         'students' => ['nama', 'email', 'kelas', 'nis'],
         'evaluationresults' => ['field1', 'field2'],
      ];

      abort_unless(isset($templates[$type]), 404);

      return response()->json([
         'type' => $type,
         'columns' => $templates[$type],
      ]);
   }
}