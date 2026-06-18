<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentRequest extends FormRequest
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
      // Mendapatkan ID user dari data student agar bisa di-ignore saat validasi update email
      $userId = $this->route('student')?->user_id;

      return [
         'nama' => ['required', 'string', 'max:255'],
         'nis' => [
            'required',
            'string',
            'max:255',
            Rule::unique('students', 'nis')->ignore($this->student),
         ],
         'kelas_id' => ['nullable', 'exists:kelas,id'],
         'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('users', 'email')->ignore($userId), // Ignore email milik user ini sendiri
         ],
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
         'email.required' => 'Email wajib diisi.',
         'email.email' => 'Format email tidak valid.',
         'email.max' => 'Email maksimal 255 karakter.',
         'email.unique' => 'Email sudah digunakan oleh akun lain.',
      ];
   }
}