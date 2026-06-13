<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'nis' => ['required', 'string', 'max:255', 'unique:students,nis'],
            'kelas_id' => ['nullable', 'exists:kelas,id'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('kelas_id') && $this->input('kelas_id') === '') {
            $this->merge(['kelas_id' => null]);
        }
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama siswa wajib diisi.',
            'nama.string' => 'Nama siswa harus berupa teks.',
            'nama.max' => 'Nama siswa maksimal 255 karakter.',
            'nis.required' => 'NIS wajib diisi.',
            'nis.string' => 'NIS harus berupa teks.',
            'nis.max' => 'NIS maksimal 255 karakter.',
            'nis.unique' => 'NIS sudah digunakan.',
            'kelas_id.exists' => 'Kelas tidak valid.',
        ];
    }
}
