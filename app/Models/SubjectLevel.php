<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['subject_id', 'tingkatan_id'])]
class SubjectLevel extends Model
{
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function tingkatan(): BelongsTo
    {
        return $this->belongsTo(Tingkatan::class);
    }
}
