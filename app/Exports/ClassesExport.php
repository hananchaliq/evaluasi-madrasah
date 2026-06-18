<?php

namespace App\Exports;

use App\Models\Kelas;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ClassesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
   protected int $no = 0;

   public function collection()
   {
      return Kelas::orderBy('nama')->get();
   }

   public function headings(): array
   {
      return [
         'No',
         'Nama Kelas',
      ];
   }

   public function map($kelas): array
   {
      return [
         ++$this->no,
         $kelas->nama,
      ];
   }
}