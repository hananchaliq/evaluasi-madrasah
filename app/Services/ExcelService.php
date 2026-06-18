<?php

namespace App\Services;

use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExcelService
{
   public function download($export, string $filename): BinaryFileResponse
   {
      return Excel::download($export, $filename);
   }
}