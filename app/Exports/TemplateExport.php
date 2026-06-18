<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class TemplateExport implements FromArray, WithHeadings
{
   protected string $title;
   protected array $headings;

   public function __construct(string $title, array $headings)
   {
      $this->title = $title;
      $this->headings = $headings;
   }

   public function headings(): array
   {
      return $this->headings;
   }

   public function array(): array
   {
      // kosong, cuma template
      return [];
   }
}