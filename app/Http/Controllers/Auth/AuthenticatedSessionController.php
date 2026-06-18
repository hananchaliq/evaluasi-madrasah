<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
   /**
    * Display the login view.
    */
   public function create(): Response
   {
      return Inertia::render('Auth/Login', [
         'canResetPassword' => Route::has('password.request'),
         'status' => session('status'),
      ]);
   }

   /**
    * Handle an incoming authentication request.
    */
   public function store(LoginRequest $request): RedirectResponse
   {
      // 1. Proses verifikasi email dan password bawaan Breeze
      $request->authenticate();

      // 2. Ambil data user yang mencoba login
      $user = Auth::user();

      // 3. Validasi Role sesuai enum tabel users ('admin', 'teacher', 'student')
      if (!$user || !in_array($user->role, ['admin', 'teacher', 'student'])) {
         // Jika role tidak sah, paksa logout saat itu juga
         Auth::guard('web')->logout();
         $request->session()->invalidate();
         $request->session()->regenerateToken();

         // Lemparkan error kembali ke input email di frontend
         throw ValidationException::withMessages([
            'email' => 'Akun Anda tidak memiliki hak akses yang sah pada sistem ini.',
         ]);
      }

      // 4. Jika lolos validasi role, regenerasi session
      $request->session()->regenerate();

      // 5. Redirect dinamis ke dashboard masing-masing sesuai role
      if ($user->role === 'admin') {
         return redirect()->intended(route('admin.dashboard', absolute: false));
      } elseif ($user->role === 'teacher') {
         return redirect()->intended(route('teacher.dashboard', absolute: false));
      } elseif ($user->role === 'student') {
         return redirect()->intended(route('student.dashboard', absolute: false));
      }

      // Default fallback jika tidak masuk kondisi di atas
      return redirect()->intended(route('dashboard', absolute: false));
   } // <--- KURUNG KURAWAL INI TADI HILANG/KURANG, BREE

   /**
    * Destroy an authenticated session.
    */
   public function destroy(Request $request): RedirectResponse
   {
      Auth::guard('web')->logout();

      $request->session()->invalidate();

      $request->session()->regenerateToken();

      return redirect('/');
   }
}