<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectCategoryRequest extends FormRequest
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
            'nama' => ['required', 'string', 'max:255', 'unique:subject_categories,nama'],
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
            'nama.required' => 'Nama kategori mata pelajaran wajib diisi.',
            'nama.string' => 'Nama kategori mata pelajaran harus berupa teks.',
            'nama.max' => 'Nama kategori mata pelajaran maksimal 255 karakter.',
            'nama.unique' => 'Nama kategori mata pelajaran sudah digunakan.',
        ];
    }
}
