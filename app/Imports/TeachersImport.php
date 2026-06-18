<?php

namespace App\Imports;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class TeachersImport implements ToModel, WithHeadingRow, WithValidation
{
   public int $inserted = 0;
   public int $skipped = 0;

   public function model(array $row)
   {
      if (User::where('email', $row['email'])->exists()) {
         $this->skipped++;
         return null;
      }

      $user = User::create([
         'name' => $row['nama'],
         'email' => $row['email'],
         'password' => Hash::make($row['nip']),
         'role' => 'teacher',
      ]);

      Teacher::create([
         'user_id' => $user->id,
         'nama' => $row['nama'],
         'nip' => $row['nip'],
      ]);

      $this->inserted++;

      return null;
   }

   public function rules(): array
   {
      return [
         'nama' => 'required',
         'email' => 'required|email',
         'nip' => 'required',
      ];
   }
}