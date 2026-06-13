<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEvaluationPeriodRequest extends FormRequest
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
            'nama' => ['required', 'string', 'max:255'],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'semester_id' => [
                'required',
                Rule::exists('semesters', 'id')->where(
                    fn ($query) => $query->where('academic_year_id', $this->input('academic_year_id')),
                ),
            ],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'is_active' => ['boolean'],
            'is_locked' => ['boolean'],
            'is_anonymous' => ['boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'is_locked' => $this->boolean('is_locked'),
            'is_anonymous' => $this->boolean('is_anonymous'),
        ]);
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama periode wajib diisi.',
            'nama.string' => 'Nama periode harus berupa teks.',
            'nama.max' => 'Nama periode maksimal 255 karakter.',
            'academic_year_id.required' => 'Tahun akademik wajib dipilih.',
            'academic_year_id.exists' => 'Tahun akademik tidak valid.',
            'semester_id.required' => 'Semester wajib dipilih.',
            'semester_id.exists' => 'Semester tidak valid untuk tahun akademik yang dipilih.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Tanggal mulai tidak valid.',
            'end_date.required' => 'Tanggal selesai wajib diisi.',
            'end_date.date' => 'Tanggal selesai tidak valid.',
            'end_date.after_or_equal' => 'Tanggal selesai harus sama atau setelah tanggal mulai.',
            'is_active.boolean' => 'Status aktif tidak valid.',
            'is_locked.boolean' => 'Status terkunci tidak valid.',
            'is_anonymous.boolean' => 'Status anonim tidak valid.',
        ];
    }
}
