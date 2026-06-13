<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama', 'subject_category_id'])]
class Subject extends Model
{
    public function subjectCategory(): BelongsTo
    {
        return $this->belongsTo(SubjectCategory::class);
    }

    public function subjectLevels(): HasMany
    {
        return $this->hasMany(SubjectLevel::class);
    }

    public function teachingAssignments(): HasMany
    {
        return $this->hasMany(TeachingAssignment::class);
    }
}
