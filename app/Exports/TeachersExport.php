<?php

namespace App\Exports;

use App\Models\Teacher;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TeachersExport implements
   FromCollection,
   WithHeadings,
   WithMapping,
   ShouldAutoSize
{
   protected int $rowNumber = 0;

   public function collection()
   {
      return Teacher::query()
         ->with('user')
         ->withCount([
            'teachingAssignments',
            'evaluations',
         ])
         ->orderBy('nama')
         ->get();
   }

   public function headings(): array
   {
      return [
         'No',
         'Nama Guru',
         'NIP',
         'Email Login',
         'Jumlah Penugasan',
         'Jumlah Evaluasi',
         'Tanggal Dibuat',
      ];
   }

   public function map($teacher): array
   {
      return [
         ++$this->rowNumber,
         $teacher->nama,
         $teacher->nip,
         $teacher->user?->email ?? '-',
         $teacher->teaching_assignments_count,
         $teacher->evaluations_count,
         $teacher->created_at?->format('d/m/Y H:i'),
      ];
   }
}