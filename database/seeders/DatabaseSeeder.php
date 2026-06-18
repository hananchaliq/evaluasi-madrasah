<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Kelas;
use App\Models\Tingkatan;
use App\Models\Subject;
use App\Models\SubjectCategory;
use App\Models\Question;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\EvaluationPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
   /**
    * Seed the application's database.
    */
   public function run(): void
   {
      // Set memory dan execution time ke tak terbatas khusus untuk seeder raksasa ini
      ini_set('memory_limit', '-1');
      set_time_limit(0);

      $faker = Faker::create('id_ID');
      $passwordHash = Hash::make('password');

      // 1. TAHUN AKADEMIK & SEMESTER
      $academicYear = AcademicYear::create(['nama' => '2026/2027', 'is_active' => true]);
      $semesterGanjil = Semester::create(['nama' => 'Ganjil', 'academic_year_id' => $academicYear->id, 'is_active' => true]);
      Semester::create(['nama' => 'Genap', 'academic_year_id' => $academicYear->id, 'is_active' => false]);

      // Periode Evaluasi
      $period = EvaluationPeriod::create([
         'nama' => 'Evaluasi Smt Ganjil Raksasa',
         'academic_year_id' => $academicYear->id,
         'semester_id' => $semesterGanjil->id,
         'start_date' => '2026-07-01',
         'end_date' => '2026-12-31',
         'is_active' => true,
         'is_locked' => false,
         'is_anonymous' => true
      ]);

      // 2. INSTRUMEN PERTANYAAN (5 Butir Pokok)
      $instrumen = [
         'Guru memulai dan mengakhiri pembelajaran tepat waktu.',
         'Guru menjelaskan materi pembelajaran dengan jelas dan mudah dipahami.',
         'Guru memberikan kesempatan kepada siswa untuk bertanya atau berdiskusi.',
         'Guru bersikap adil, objektif, dan tidak diskriminatif kepada seluruh siswa.',
         'Guru memanfaatkan teknologi atau media pembelajaran yang menarik saat mengajar.'
      ];
      $questionIds = [];
      foreach ($instrumen as $index => $tanya) {
         $q = Question::create(['pertanyaan' => $tanya, 'urutan' => $index + 1, 'is_active' => true]);
         $questionIds[] = $q->id;
      }

      // 3. KATEGORI & DAFTAR MATA PELAJARAN (30 Mapel)
      $catUmum = SubjectCategory::create(['nama' => 'Umum / Produktif']);
      $catAgama = SubjectCategory::create(['nama' => 'Keagamaan']);

      $mapelsUmum = [
         'Matematika',
         'Bahasa Indonesia',
         'Bahasa Inggris',
         'Fisika',
         'Kimia',
         'Biologi',
         'Sejarah',
         'Geografi',
         'Ekonomi',
         'Sosiologi',
         'Informatika',
         'Pendidikan Pancasila',
         'PJOK',
         'Seni Budaya',
         'Prakarya',
         'Dasar-Dasar Kejuruan 1',
         'Dasar-Dasar Kejuruan 2',
         'Sistem Operasi',
         'Jaringan Komputer',
         'Pemrograman Web',
         'Pemrograman Berorientasi Objek',
         'Basis Data',
         'Desain Grafis',
         'Produk Kreatif Kewirausahaan'
      ];
      $mapelsAgama = ['Al-Qur\'an Hadis', 'Akidah Akhlak', 'Fikih', 'Sejarah Kebudayaan Islam', 'Bahasa Arab', 'Tauhid'];

      $allSubjects = [];
      foreach ($mapelsUmum as $i => $m) {
         $allSubjects[] = Subject::create(['kode' => 'MPU-' . sprintf('%03d', $i + 1), 'nama' => $m, 'subject_category_id' => $catUmum->id]);
      }
      foreach ($mapelsAgama as $i => $m) {
         $allSubjects[] = Subject::create(['kode' => 'MPA-' . sprintf('%03d', $i + 1), 'nama' => $m, 'subject_category_id' => $catAgama->id]);
      }

      // 4. TINGKATAN & KELAS (12 Rombel)
      $tingkatans = [];
      foreach (['X', 'XI', 'XII'] as $t) {
         $tingkatans[] = Tingkatan::create(['nama' => $t]);
      }

      $allKelas = [];
      $jurusan = ['RPL', 'TKJ', 'MIPA', 'IPS'];
      foreach ($tingkatans as $t) {
         foreach ($jurusan as $j) {
            $allKelas[] = Kelas::create([
               'nama' => $t->nama . ' ' . $j,
               'tingkatan_id' => $t->id
            ]);
         }
      }

      // 5. MEMBUAT 1 AKUN ADMIN UTAMA
      User::create([
         'name' => 'Admin Super',
         'email' => 'admin@test.com',
         'role' => 'admin',
         'password' => $passwordHash
      ]);

      // 6. GENERATE 70 GURU SECARA OTOMATIS
      $teachers = [];
      for ($g = 1; $g <= 70; $g++) {
         $gender = $faker->randomElement(['male', 'female']);
         $namaGuru = $faker->name($gender) . ', ' . $faker->randomElement(['S.Pd', 'M.Pd', 'S.T', 'S.Kom', 'S.Th.I']);

         $userGuru = User::create([
            'name' => $namaGuru,
            'email' => 'guru' . $g . '@test.com',
            'role' => 'teacher',
            'password' => $passwordHash
         ]);

         $teachers[] = Teacher::create([
            'user_id' => $userGuru->id,
            'nama' => $namaGuru,
            'nip' => '199' . $faker->numerify('######') . '201' . $faker->numerify('#####')
         ]);
      }

      // 7. GENERATE 360 SISWA (30 Siswa per Kelas di 12 Kelas)
      $studentsByKelas = []; // Kita kelompokkan siswa berdasarkan ID kelas untuk mempermudah looping evaluasi
      $studentCounter = 1;

      foreach ($allKelas as $kelasItem) {
         $studentsByKelas[$kelasItem->id] = [];
         for ($s = 1; $s <= 30; $s++) {
            $namaSiswa = $faker->name;
            $userSiswa = User::create([
               'name' => $namaSiswa,
               'email' => 'siswa' . $studentCounter . '@test.com',
               'role' => 'student',
               'password' => $passwordHash
            ]);

            $studentObj = Student::create([
               'user_id' => $userSiswa->id,
               'nama' => $namaSiswa,
               'nis' => '1211' . $faker->numerify('##############'),
               'kelas_id' => $kelasItem->id
            ]);

            $studentsByKelas[$kelasItem->id][] = $studentObj;
            $studentCounter++;
         }
      }

      // 8. PETAKAN PENUGASAN MENGAJAR SECARA RANDOM DAN REALISTIS
      $assignmentsByKelas = [];
      foreach ($allKelas as $kelasItem) {
         $assignmentsByKelas[$kelasItem->id] = [];
         $assignedMapels = $faker->randomElements($allSubjects, rand(6, 8)); // 6-8 Mapel per kelas

         foreach ($assignedMapels as $mapel) {
            $guruAcak = $faker->randomElement($teachers);

            // Menggunakan DB table insertOrIgnore demi performa & bypass unique constraint
            DB::table('teaching_assignments')->insertOrIgnore([
               'teacher_id' => $guruAcak->id,
               'subject_id' => $mapel->id,
               'kelas_id' => $kelasItem->id,
               'academic_year_id' => $academicYear->id,
               'semester_id' => $semesterGanjil->id,
               'created_at' => NOW(),
               'updated_at' => NOW()
            ]);

            // Ambil kembali penugasan barusan untuk referensi data evaluasi siswa
            $assignmentsByKelas[$kelasItem->id][] = $guruAcak->id;
         }
      }

      // 9. GENERATE DATA EVALUASI DAN DETAIL JAWABAN (MASSIVE SEEDING)
      $evaluationsToInsert = [];
      $answersToInsert = [];

      $evaluationIdCounter = 1;

      // Loop setiap kelas
      foreach ($allKelas as $kelasItem) {
         $daftarSiswa = $studentsByKelas[$kelasItem->id];
         $daftarGuruID = array_unique($assignmentsByKelas[$kelasItem->id]);

         // Setiap siswa di kelas tersebut wajib mengevaluasi guru-guru yang mengajar di kelasnya
         foreach ($daftarSiswa as $siswa) {
            foreach ($daftarGuruID as $teacherId) {

               // Kita buat variasi status pengisian siswa secara acak (Randomize workflow):
               // 75% submitted (selesai dikirim), 15% draft (baru disimpan sebagian), 10% belum diisi sama sekali
               $skenario = $faker->randomElement(['submitted', 'submitted', 'submitted', 'draft', 'belum_diisi']);

               if ($skenario === 'belum_diisi') {
                  continue; // Lewati, tidak perlu buat row evaluasi di database
               }

               if ($skenario === 'submitted') {
                  // Generate skor random antara 3 s.d 5 agar performa gurunya terlihat logis dan bagus
                  $scores = [];
                  for ($i = 0; $i < count($questionIds); $i++) {
                     $scores[] = rand(3, 5);
                  }
                  $average = array_sum($scores) / count($scores);

                  $evaluationsToInsert[] = [
                     'id' => $evaluationIdCounter,
                     'student_id' => $siswa->id,
                     'teacher_id' => $teacherId,
                     'evaluation_period_id' => $period->id,
                     'academic_year_id' => $academicYear->id,
                     'semester_id' => $semesterGanjil->id,
                     'status' => 'submitted',
                     'average_score' => $average,
                     'submitted_at' => $faker->dateTimeBetween('-2 months', 'now'),
                     'created_at' => NOW(),
                     'updated_at' => NOW()
                  ];

                  // Siapkan detail jawaban untuk 5 pertanyaan
                  foreach ($questionIds as $index => $qId) {
                     $answersToInsert[] = [
                        'evaluation_id' => $evaluationIdCounter,
                        'question_id' => $qId,
                        'score' => $scores[$index],
                        'created_at' => NOW(),
                        'updated_at' => NOW()
                     ];
                  }

               } elseif ($skenario === 'draft') {
                  // Skenario draft: baru mengisi 2 atau 3 pertanyaan secara acak dari total 5 pertanyaan
                  $evaluationsToInsert[] = [
                     'id' => $evaluationIdCounter,
                     'student_id' => $siswa->id,
                     'teacher_id' => $teacherId,
                     'evaluation_period_id' => $period->id,
                     'academic_year_id' => $academicYear->id,
                     'semester_id' => $semesterGanjil->id,
                     'status' => 'draft',
                     'average_score' => null,
                     'submitted_at' => null,
                     'created_at' => NOW(),
                     'updated_at' => NOW()
                  ];

                  // Masukkan jawaban hanya untuk beberapa pertanyaan saja (simulasi draft belum lengkap)
                  $jumlahPertanyaanDraft = rand(2, 3);
                  for ($i = 0; $i < $jumlahPertanyaanDraft; $i++) {
                     $answersToInsert[] = [
                        'evaluation_id' => $evaluationIdCounter,
                        'question_id' => $questionIds[$i],
                        'score' => rand(3, 5),
                        'created_at' => NOW(),
                        'updated_at' => NOW()
                     ];
                  }
               }

               $evaluationIdCounter++;
            }
         }
      }

      // 10. EKSEKUSI DATA MASSAL DENGAN CHUNKING (Anti Crash-Limit)
      // Masukkan data master evaluasi secara berkala per 1.000 baris
      foreach (array_chunk($evaluationsToInsert, 1000) as $chunk) {
         DB::table('evaluations')->insert($chunk);
      }

      // Masukkan data detail jawaban evaluasi secara berkala per 2.000 baris
      foreach (array_chunk($answersToInsert, 2000) as $chunk) {
         DB::table('evaluation_answers')->insert($chunk);
      }

      // Ganti nomor 11 dengan DB murni jika tidak ada model SystemSetting
      DB::table('system_settings')->insertOrIgnore([
         ['key' => 'nama_madrasah', 'value' => 'MA/SMK Raksasa Pusat Unggulan', 'label' => 'Nama Madrasah', 'type' => 'text', 'group' => 'general', 'created_at' => NOW(), 'updated_at' => NOW()],
         ['key' => 'minimal_skor_kelayakan', 'value' => '3.75', 'label' => 'Minimal Skor Kelayakan Guru', 'type' => 'text', 'group' => 'evaluation', 'created_at' => NOW(), 'updated_at' => NOW()]
      ]);
   }
}