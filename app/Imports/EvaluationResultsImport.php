<?php

namespace App\Imports;

use App\Models\Evaluation;
use App\Models\Student;
use App\Models\TeachingAssignment;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EvaluationResultsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Evaluation([
            'student_id' => Student::where('nama', $row['siswa'])->first()?->id,
            'teaching_assignment_id' => TeachingAssignment::whereHas('subject', function ($q) use ($row) {
                $q->where('nama', $row['mapel']);
            })->first()?->id,
            'average_score' => $row['nilai'],
            'status' => $row['status'] ?? 'submitted',
        ]);
    }
}