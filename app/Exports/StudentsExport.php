<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
   protected int $rowNumber = 0;

   public function collection()
   {
      return Student::query()
         ->select('id', 'nama', 'nis', 'kelas_id', 'created_at')
         ->with([
            'user:id,email',
            'kelas:id,nama',
            'evaluations'
         ])
         ->withCount('evaluations')
         ->orderBy('nama')
         ->get();
   }

   public function headings(): array
   {
      return [
         'No',
         'Nama Siswa',
         'NIS',
         'Email Login',
         'Kelas',
         'Jumlah Evaluasi',
         'Tanggal Dibuat',
      ];
   }

   public function map($student): array
   {
      return [
         ++$this->rowNumber,
         $student->nama,
         $student->nis,
         $student->user?->email ?? '-',
         $student->kelas?->nama ?? '-',
         $student->evaluations_count ?? 0,
         $student->created_at?->format('d/m/Y H:i'),
      ];
   }
}