<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
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
            'nip' => ['nullable', 'string', 'max:255', 'unique:teachers,nip'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('nip') && $this->input('nip') === '') {
            $this->merge(['nip' => null]);
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
            'nama.required' => 'Nama guru wajib diisi.',
            'nama.string' => 'Nama guru harus berupa teks.',
            'nama.max' => 'Nama guru maksimal 255 karakter.',
            'nip.string' => 'NIP guru harus berupa teks.',
            'nip.max' => 'NIP guru maksimal 255 karakter.',
            'nip.unique' => 'NIP guru sudah digunakan.',
        ];
    }
}
