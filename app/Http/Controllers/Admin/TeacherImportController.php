<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Imports\TeachersImport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TeacherImportController extends Controller
{
   public function create()
   {
      return Inertia::render('Admin/Teachers/Import');
   }

   public function store(Request $request)
   {
      $request->validate([
         'file' => [
            'required',
            'file',
            'mimes:xlsx,xls',
         ],
      ]);

      Excel::import(
         new TeachersImport(),
         $request->file('file')
      );

      return redirect()
         ->route('admin.teachers.index')
         ->with(
            'success',
            'Import guru berhasil.'
         );
   }
}
