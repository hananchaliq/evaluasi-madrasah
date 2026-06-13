<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSemesterRequest extends FormRequest
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
            'nama' => [
                'required',
                'string',
                'max:255',
                Rule::unique('semesters', 'nama')->where(
                    fn ($query) => $query->where('academic_year_id', $this->input('academic_year_id')),
                ),
            ],
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active'),
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
            'nama.required' => 'Nama semester wajib diisi.',
            'nama.string' => 'Nama semester harus berupa teks.',
            'nama.max' => 'Nama semester maksimal 255 karakter.',
            'nama.unique' => 'Nama semester sudah digunakan pada tahun akademik ini.',
            'academic_year_id.required' => 'Tahun akademik wajib dipilih.',
            'academic_year_id.exists' => 'Tahun akademik tidak valid.',
            'is_active.boolean' => 'Status aktif tidak valid.',
        ];
    }
}
