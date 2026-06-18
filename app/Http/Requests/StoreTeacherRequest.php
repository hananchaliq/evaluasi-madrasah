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
         // NIP diubah jadi required karena wajib digunakan untuk password default akun
         'nip' => ['required', 'string', 'max:255', 'unique:teachers,nip'],
         // Tambahkan validasi email untuk tabel users
         'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
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

         'nip.required' => 'NIP guru wajib diisi sebagai password default.',
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