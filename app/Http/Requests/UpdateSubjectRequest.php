<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubjectRequest extends FormRequest
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
                Rule::unique('subjects', 'nama')
                    ->where(fn ($query) => $query->where('subject_category_id', $this->input('subject_category_id')))
                    ->ignore($this->subject),
            ],
            'subject_category_id' => ['required', 'exists:subject_categories,id'],
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
            'nama.required' => 'Nama mata pelajaran wajib diisi.',
            'nama.string' => 'Nama mata pelajaran harus berupa teks.',
            'nama.max' => 'Nama mata pelajaran maksimal 255 karakter.',
            'nama.unique' => 'Nama mata pelajaran sudah digunakan pada kategori ini.',
            'subject_category_id.required' => 'Kategori mata pelajaran wajib dipilih.',
            'subject_category_id.exists' => 'Kategori mata pelajaran tidak valid.',
        ];
    }
}
