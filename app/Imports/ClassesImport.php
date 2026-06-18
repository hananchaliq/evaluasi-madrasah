<?php

namespace App\Imports;

use App\Models\Kelas;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ClassesImport implements ToModel, WithHeadingRow
{
   public function model(array $row)
   {
      return new Kelas([
         'nama' => $row['nama_kelas'],
      ]);
   }
}