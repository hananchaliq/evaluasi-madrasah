<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BulkQuestionRequest extends FormRequest
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
            'action' => ['required', 'in:activate,deactivate,delete'],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:questions,id'],
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
            'action.required' => 'Aksi massal wajib dipilih.',
            'action.in' => 'Aksi massal tidak valid.',
            'ids.required' => 'Pilih minimal satu pertanyaan.',
            'ids.array' => 'Data pertanyaan tidak valid.',
            'ids.min' => 'Pilih minimal satu pertanyaan.',
            'ids.*.integer' => 'Data pertanyaan tidak valid.',
            'ids.*.exists' => 'Pertanyaan tidak ditemukan.',
        ];
    }
}
