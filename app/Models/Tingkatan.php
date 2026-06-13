<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['nama'])]
class Tingkatan extends Model
{
    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    public function subjectLevels(): HasMany
    {
        return $this->hasMany(SubjectLevel::class);
    }
}
