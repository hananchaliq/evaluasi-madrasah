<?php

namespace App\Imports;

use App\Models\TeachingAssignment;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Kelas;
use App\Models\AcademicYear;
use App\Models\Semester;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TeachingAssignmentsImport implements ToModel, WithHeadingRow
{
   public function model(array $row)
   {
      return new TeachingAssignment([
         'teacher_id' => Teacher::where('nama', $row['guru'])->first()?->id,
         'subject_id' => Subject::where('nama', $row['mapel'])->first()?->id,
         'kelas_id' => Kelas::where('nama', $row['kelas'])->first()?->id,
         'academic_year_id' => AcademicYear::where('nama', $row['tahun_ajaran'])->first()?->id,
         'semester_id' => Semester::where('nama', $row['semester'])->first()?->id,
      ]);
   }
}