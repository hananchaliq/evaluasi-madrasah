<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
   protected $fillable = [
      'user_id',
      'nama',
      'nip',
   ];

   public function user(): BelongsTo
   {
      return $this->belongsTo(User::class);
   }

   public function teachingAssignments(): HasMany
   {
      return $this->hasMany(TeachingAssignment::class);
   }

   public function evaluations(): HasMany
   {
      return $this->hasMany(Evaluation::class);
   }
}