<?php

namespace App\Exports;

use App\Models\Evaluation;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class EvaluationResultsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
   protected int $no = 0;

   public function collection()
   {
      return Evaluation::with([
         'student',
         'teachingAssignment.teacher',
         'teachingAssignment.subject'
      ])->get();
   }

   public function headings(): array
   {
      return [
         'No',
         'Siswa',
         'Guru',
         'Mapel',
         'Rata-rata Nilai',
         'Status',
         'Tanggal Submit',
      ];
   }

   public function map($e): array
   {
      return [
         ++$this->no,
         $e->student?->nama ?? '-',
         $e->teachingAssignment?->teacher?->nama ?? '-',
         $e->teachingAssignment?->subject?->nama ?? '-',
         $e->average_score ?? 0,
         $e->status,
         $e->submitted_at?->format('d/m/Y H:i'),
      ];
   }
}