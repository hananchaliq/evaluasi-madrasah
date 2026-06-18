<?php

use App\Imports\ClassesImport;
use App\Imports\EvaluationResultsImport;
use App\Imports\StudentsImport;
use App\Imports\SubjectsImport;
use App\Imports\TeachersImport;
use App\Imports\TeachingAssignmentsImport;


return [

    'teachers' => TeachersImport::class,
    'students' => StudentsImport::class,
    'evaluationresults' => EvaluationResultsImport::class,
    'subjects' => SubjectsImport::class,
    'kelas' => ClassesImport::class,
    'teaching-assignment' => TeachingAssignmentsImport::class

];