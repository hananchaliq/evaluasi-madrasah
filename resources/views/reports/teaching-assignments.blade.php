<!DOCTYPE html>
<html>

<head>
   <meta charset="utf-8">
   <title>Laporan Penugasan Guru</title>

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
      <strong>LAPORAN PENUGASAN GURU</strong>
   </div>

   <div class="info">
      Tanggal Cetak: {{ $printedAt->format('d F Y H:i') }}
   </div>

   <table>
      <thead>
         <tr>
            <th>No</th>
            <th>Guru</th>
            <th>Mapel</th>
            <th>Kelas</th>
            <th>Tahun Ajaran</th>
            <th>Semester</th>
         </tr>
      </thead>

      <tbody>
         @forelse($assignments as $t)
            <tr>
               <td class="text-center">{{ $loop->iteration }}</td>
               <td>{{ $t->teacher?->nama ?? '-' }}</td>
               <td>{{ $t->subject?->nama ?? '-' }}</td>
               <td class="text-center">{{ $t->kelas?->nama ?? '-' }}</td>
               <td class="text-center">{{ $t->academicYear?->nama ?? '-' }}</td>
               <td class="text-center">{{ $t->semester?->nama ?? '-' }}</td>
            </tr>
         @empty
            <tr>
               <td colspan="6" class="text-center">Tidak ada data penugasan.</td>
            </tr>
         @endforelse
      </tbody>
   </table>

</body>

</html>