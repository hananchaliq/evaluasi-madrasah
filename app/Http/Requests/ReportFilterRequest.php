<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReportFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'academic_year_id' => ['nullable', 'integer', 'exists:academic_years,id'],
            'semester_id' => ['nullable', 'integer', 'exists:semesters,id'],
            'teacher_id' => ['nullable', 'integer', 'exists:teachers,id'],
            'kelas_id' => ['nullable', 'integer', 'exists:kelas,id'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
            'subject_category_id' => ['nullable', 'integer', 'exists:subject_categories,id'],
            'evaluation_period_id' => ['nullable', 'integer', 'exists:evaluation_periods,id'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'search.max' => 'Kata kunci pencarian maksimal 255 karakter.',
            'academic_year_id.exists' => 'Tahun akademik tidak valid.',
            'semester_id.exists' => 'Semester tidak valid.',
            'teacher_id.exists' => 'Guru tidak valid.',
            'kelas_id.exists' => 'Kelas tidak valid.',
            'subject_id.exists' => 'Mata pelajaran tidak valid.',
            'subject_category_id.exists' => 'Kategori mata pelajaran tidak valid.',
            'evaluation_period_id.exists' => 'Periode evaluasi tidak valid.',
        ];
    }
}
