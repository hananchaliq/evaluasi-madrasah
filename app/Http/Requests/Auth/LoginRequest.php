<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
   public function authorize(): bool
   {
      return true;
   }

   public function rules(): array
   {
      return [
         'email' => ['required', 'string', 'email'],
         'password' => ['required', 'string'],
         'role' => ['required', 'string', 'in:student,teacher,admin'],
      ];
   }

   public function authenticate(): void
   {
      $this->ensureIsNotRateLimited();

      // 1. Cukup cocokkan email dan password saja ke Auth::attempt agar hash bcrypt bekerja normal
      $credentials = [
         'email' => $this->input('email'),
         'password' => $this->input('password'),
      ];

      // 2. Jalankan Autentikasi dasar terlebih dahulu
      if (!Auth::attempt($credentials, $this->boolean('remember'))) {
         RateLimiter::hit($this->throttleKey());

         throw ValidationException::withMessages([
            'email' => 'Email atau Password yang Anda masukkan salah.',
         ]);
      }

      // 3. Jika password benar, ambil data user yang berhasil login
      $user = Auth::user();

      // 4. COCOKKAN ROLE: Apakah role di database sesuai dengan tab role yang dipilih user di frontend?
      if ($user->role !== $this->input('role')) {
         // Jika tidak sesuai, paksa logout kembali saat itu juga
         Auth::logout();

         RateLimiter::hit($this->throttleKey());

         throw ValidationException::withMessages([
            'email' => 'Role akun yang Anda pilih tidak sesuai dengan data sistem.',
         ]);
      }

      RateLimiter::clear($this->throttleKey());
   }

   public function ensureIsNotRateLimited(): void
   {
      if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
         return;
      }

      event(new Lockout($this));

      $seconds = RateLimiter::availableIn($this->throttleKey());

      throw ValidationException::withMessages([
         'email' => trans('auth.throttle', [
            'seconds' => $seconds,
            'minutes' => ceil($seconds / 60),
         ]),
      ]);
   }

   public function throttleKey(): string
   {
      return Str::transliterate(Str::lower($this->input('email')) . '|' . $this->ip());
   }
}