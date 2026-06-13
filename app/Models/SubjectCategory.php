<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama'])]
class SubjectCategory extends Model
{
    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }
}
