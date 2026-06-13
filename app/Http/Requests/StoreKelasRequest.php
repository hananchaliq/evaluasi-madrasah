<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreKelasRequest extends FormRequest
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
                Rule::unique('kelas', 'nama')->where(
                    fn ($query) => $query->where('tingkatan_id', $this->input('tingkatan_id')),
                ),
            ],
            'tingkatan_id' => ['required', 'exists:tingkatans,id'],
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
            'nama.required' => 'Nama kelas wajib diisi.',
            'nama.string' => 'Nama kelas harus berupa teks.',
            'nama.max' => 'Nama kelas maksimal 255 karakter.',
            'nama.unique' => 'Nama kelas sudah digunakan pada tingkatan ini.',
            'tingkatan_id.required' => 'Tingkatan wajib dipilih.',
            'tingkatan_id.exists' => 'Tingkatan tidak valid.',
        ];
    }
}
