<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends FormRequest
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
      // Ambil instance teacher dari route binding
      $teacher = $this->route('teacher');

      return [
         'nama' => ['required', 'string', 'max:255'],
         'nip' => [
            'required', // Diubah jadi required agar konsisten dengan proses store
            'string',
            'max:255',
            Rule::unique('teachers', 'nip')->ignore($teacher->id),
         ],
         'email' => [
            'required',
            'string',
            'email',
            'max:255',
            // Ingore email user ini sendiri berdasarkan user_id yang terhubung
            Rule::unique('users', 'email')->ignore($teacher->user_id),
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
         'nama.required' => 'Nama guru wajib diisi.',
         'nama.string' => 'Nama guru harus berupa teks.',
         'nama.max' => 'Nama guru maksimal 255 karakter.',

         'nip.required' => 'NIP guru wajib diisi.',
         'nip.string' => 'NIP guru harus berupa teks.',
         'nip.max' => 'NIP guru maksimal 255 karakter.',
         'nip.unique' => 'NIP guru sudah digunakan.',

         'email.required' => 'Email akun wajib diisi.',
         'email.string' => 'Email harus berupa teks.',
         'email.email' => 'Format email tidak valid.',
         'email.max' => 'Email maksimal 255 karakter.',
         'email.unique' => 'Email sudah terdaftar pada akun lain.',
      ];
   }
}