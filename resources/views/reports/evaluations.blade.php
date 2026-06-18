<!DOCTYPE html>
<html>

<head>
   <meta charset="utf-8">
   <title>Laporan Hasil Evaluasi</title>

   <style>
      body {
         font-family: DejaVu Sans, sans-serif;
         font-size: 11px;
      }

      .header {
         text-align: center;
         margin-bottom: 20px;
      }

      .header h2 {
         margin: 0;
      }

      .header h3 {
         margin: 4px 0;
      }

      .info {
         margin-bottom: 15px;
      }

      table {
         width: 100%;
         border-collapse: collapse;
      }

      table th,
      table td {
         border: 1px solid #000;
         padding: 6px;
      }

      table th {
         background: #f3f4f6;
         text-align: center;
      }

      .text-center {
         text-align: center;
      }
   </style>
</head>

<body>

   <div class="header">
      <h2>MAKN ENDE</h2>
      <h3>Sistem Evaluasi Pembelajaran Madrasah</h3>
      <strong>LAPORAN HASIL EVALUASI</strong>
   </div>

   <div class="info">
      Tanggal Cetak: {{ $printedAt->format('d F Y H:i') }}
   </div>

   <table>
      <thead>
         <tr>
            <th>No</th>
            <th>Siswa</th>
            <th>Guru</th>
            <th>Mapel</th>
            <th>Nilai</th>
            <th>Status</th>
            <th>Tanggal</th>
         </tr>
      </thead>

      <tbody>
         @forelse($evaluations as $e)
            <tr>
               <td class="text-center">{{ $loop->iteration }}</td>
               <td>{{ $e->student?->nama ?? '-' }}</td>
               <td>{{ $e->teachingAssignment?->teacher?->nama ?? '-' }}</td>
               <td>{{ $e->teachingAssignment?->subject?->nama ?? '-' }}</td>
               <td class="text-center">{{ $e->average_score ?? 0 }}</td>
               <td class="text-center">{{ $e->status }}</td>
               <td class="text-center">
                  {{ $e->submitted_at?->format('d/m/Y H:i') ?? '-' }}
               </td>
            </tr>
         @empty
            <tr>
               <td colspan="7" class="text-center">Tidak ada data evaluasi.</td>
            </tr>
         @endforelse
      </tbody>
   </table>

</body>

</html>