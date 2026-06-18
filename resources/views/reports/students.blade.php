AN
<!DOCTYPE html>
<html>

<head>
   <meta charset="utf-8">
   <title>Laporan Data Siswa</title>

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
      <strong>LAPORAN DATA SISWA</strong>
   </div>

   <div class="info">
      Tanggal Cetak:
      {{ $printedAt->format('d F Y H:i') }}
   </div>

   <table>
      <thead>
         <tr>
            <th width="40">No</th>
            <th>Nama Siswa</th>
            <th>NIS</th>
            <th>Email Login</th>
            <th>Kelas</th>
            <th>Evaluasi</th>
         </tr>
      </thead>

      <tbody>
         @forelse($students as $student)
            <tr>
               <td class="text-center">
                  {{ $loop->iteration }}
               </td>
               <td>
                  {{ $student->nama }}
               </td>
               <td>
                  {{ $student->nis }}
               </td>
               <td>
                  {{ $student->user?->email ?? '-' }}
               </td>
               <td class="text-center">
                  {{ $student->kelas?->nama ?? '-' }}
               </td>
               <td class="text-center">
                  {{ $student->evaluations_count }}
               </td>
            </tr>
         @empty
            <tr>
               <td colspan="6" class="text-center">
                  Tidak ada data siswa.
               </td>
            </tr>
         @endforelse
      </tbody>
   </table>

</body>

</html>