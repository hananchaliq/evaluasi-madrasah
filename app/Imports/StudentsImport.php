<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use App\Models\Kelas;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToModel, WithHeadingRow
{
   public function model(array $row)
   {
      $user = User::create([
         'name' => $row['nama_siswa'],
         'email' => $row['email_login'],
         'password' => Hash::make($row['nis']),
         'role' => 'student',
      ]);

      return new Student([
         'user_id' => $user->id,
         'nama' => $row['nama_siswa'],
         'nis' => $row['nis'],
         'kelas_id' => Kelas::where('nama', $row['kelas'])->first()?->id,
      ]);
   }
}