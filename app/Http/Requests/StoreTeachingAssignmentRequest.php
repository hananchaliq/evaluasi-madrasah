<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeachingAssignmentRequest extends FormRequest
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
            'teacher_id' => [
                'required',
                'exists:teachers,id',
                Rule::unique('teaching_assignments', 'teacher_id')
                    ->where('subject_id', $this->input('subject_id'))
                    ->where('kelas_id', $this->input('kelas_id'))
                    ->where('academic_year_id', $this->input('academic_year_id'))
                    ->where('semester_id', $this->input('semester_id')),
            ],
            'subject_id' => ['required', 'exists:subjects,id'],
            'kelas_id' => ['required', 'exists:kelas,id'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'semester_id' => [
                'required',
                Rule::exists('semesters', 'id')->where(
                    fn ($query) => $query->where('academic_year_id', $this->input('academic_year_id')),
                ),
            ],
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'teacher_id.required' => 'Guru wajib dipilih.',
            'teacher_id.exists' => 'Guru tidak valid.',
            'teacher_id.unique' => 'Penugasan mengajar dengan kombinasi ini sudah ada.',
            'subject_id.required' => 'Mata pelajaran wajib dipilih.',
            'subject_id.exists' => 'Mata pelajaran tidak valid.',
            'kelas_id.required' => 'Kelas wajib dipilih.',
            'kelas_id.exists' => 'Kelas tidak valid.',
            'academic_year_id.required' => 'Tahun akademik wajib dipilih.',
            'academic_year_id.exists' => 'Tahun akademik tidak valid.',
            'semester_id.required' => 'Semester wajib dipilih.',
            'semester_id.exists' => 'Semester tidak valid untuk tahun akademik yang dipilih.',
        ];
    }
}
