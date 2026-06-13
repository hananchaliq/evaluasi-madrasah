<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subject_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignId('tingkatan_id')->constrained('tingkatans')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['subject_id', 'tingkatan_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_levels');
    }
};
