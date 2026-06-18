<?php

namespace App\Exports;

use App\Models\Subject;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SubjectsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
   protected int $no = 0;

   public function collection()
   {
      return Subject::with('SubjectCategory')->orderBy('nama')->get();
   }

   public function headings(): array
   {
      return [
         'No',
         'Kode',
         'Nama Mapel',
         'Kategori',
      ];
   }

   public function map($subject): array
   {
      return [
         ++$this->no,
         $subject->kode,
         $subject->nama,
         $subject->subjectCategory?->nama ?? '-',
      ];
   }
}