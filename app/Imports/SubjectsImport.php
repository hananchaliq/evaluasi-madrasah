<?php

namespace App\Imports;

use App\Models\Subject;
use App\Models\SubjectCategory;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SubjectsImport implements ToModel, WithHeadingRow
{
   public function model(array $row)
   {
      $category = SubjectCategory::where('nama', $row['kategori'])->first();

      return new Subject([
         'kode' => $row['kode'],
         'nama' => $row['nama_mapel'],
         'subject_category_id' => $category?->id,
      ]);
   }
}