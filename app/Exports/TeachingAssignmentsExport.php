<?php

namespace App\Exports;

use App\Models\TeachingAssignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TeachingAssignmentsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
   protected int $no = 0;

   public function collection()
   {
      return TeachingAssignment::with([
         'teacher',
         'subject',
         'kelas'
      ])->get();
   }

   public function headings(): array
   {
      return [
         'No',
         'Guru',
         'Mapel',
         'Kelas',
         'Tahun Ajaran',
         'Semester',
      ];
   }

   public function map($t): array
   {
      return [
         ++$this->no,
         $t->teacher?->nama ?? '-',
         $t->subject?->nama ?? '-',
         $t->kelas?->nama ?? '-',
         $t->academicYear?->nama ?? '-',
         $t->semester?->nama ?? '-',
      ];
   }
}