<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEvaluationRequest extends FormRequest
{
   /**
    * Determine if the user is authorized to make this request.
    */
   public function authorize(): bool
   {
      // Berikan true karena otorisasi spesifik sudah ditangani di level Controller/Service
      return true;
   }

   /**
    * Get the validation rules that apply to the request.
    */
   public function rules(): array
   {
      return [
         'submit' => ['required', 'boolean'],
         'answers' => ['required', 'array', 'min:1'],
         'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],

         // Aturan Krusial: Jika tombol 'Kirim Evaluasi' diklik (submit = true), 
         // maka semua baris pertanyaan WAJIB memiliki skor antara 1 sampai 5.
         // Jika hanya klik 'Simpan Draft' (submit = false), skor boleh null/kosong.
         'answers.*.score' => $this->boolean('submit')
            ? ['required', 'integer', 'between:1,5']
            : ['nullable', 'integer', 'between:1,5'],
      ];
   }

   /**
    * Custom error messages untuk Inertia frontend.
    */
   public function messages(): array
   {
      return [
         'answers.required' => 'Daftar pertanyaan tidak boleh kosong.',
         'answers.*.score.required' => 'Semua pertanyaan wajib diisi sebelum evaluasi dikirim.',
         'answers.*.score.between' => 'Skor penilaian harus berada di antara skala 1 sampai 5.',
      ];
   }
}