import {
    HiOutlineAcademicCap,
    HiOutlineBell,
    HiOutlineBookOpen,
    HiOutlineChartBar,
    HiOutlineClipboardDocumentList,
    HiOutlineCog6Tooth,
    HiOutlineDocumentArrowDown,
    HiOutlineDocumentArrowUp,
    HiOutlineDocumentChartBar,
    HiOutlineDocumentText,
    HiOutlineHome,
    HiOutlineQueueList,
    HiOutlineShieldCheck,
    HiOutlineTableCells,
    HiOutlineTrophy,
    HiOutlineUserGroup,
    HiOutlineUsers,
} from 'react-icons/hi2';

/**
 * Konfigurasi navigasi sidebar admin.
 * Item dengan `route: null` adalah placeholder untuk modul yang belum diimplementasikan.
 */
export const adminNavigation = [
    {
        key: 'utama',
        label: 'Utama',
        items: [
            {
                key: 'dashboard',
                label: 'Beranda',
                icon: HiOutlineHome,
                route: 'dashboard',
            },
        ],
    },
    {
        key: 'data-master',
        label: 'Data Master',
        items: [
            {
                key: 'tingkatans',
                label: 'Tingkatan',
                icon: HiOutlineQueueList,
                route: 'tingkatans.index',
                routePattern: 'tingkatans.*',
            },
            {
                key: 'kelas',
                label: 'Kelas',
                icon: HiOutlineAcademicCap,
                route: 'kelas.index',
                routePattern: 'kelas.*',
            },
            {
                key: 'subject-categories',
                label: 'Kategori Mata Pelajaran',
                icon: HiOutlineTableCells,
                route: 'subject-categories.index',
                routePattern: 'subject-categories.*',
            },
            {
                key: 'subjects',
                label: 'Mata Pelajaran',
                icon: HiOutlineBookOpen,
                route: 'subjects.index',
                routePattern: 'subjects.*',
            },
            {
                key: 'academic-years',
                label: 'Tahun Akademik',
                icon: HiOutlineDocumentText,
                route: 'academic-years.index',
                routePattern: 'academic-years.*',
            },
            {
                key: 'semesters',
                label: 'Semester',
                icon: HiOutlineClipboardDocumentList,
                route: 'semesters.index',
                routePattern: 'semesters.*',
            },
        ],
    },
    {
        key: 'pengguna',
        label: 'Pengguna',
        items: [
            {
                key: 'teachers',
                label: 'Guru',
                icon: HiOutlineUserGroup,
                route: 'teachers.index',
                routePattern: 'teachers.*',
            },
            {
                key: 'students',
                label: 'Siswa',
                icon: HiOutlineUsers,
                route: 'students.index',
                routePattern: 'students.*',
            },
        ],
    },
    {
        key: 'evaluasi',
        label: 'Evaluasi',
        items: [
            {
                key: 'teaching-assignments',
                label: 'Penugasan Mengajar',
                icon: HiOutlineClipboardDocumentList,
                route: 'teaching-assignments.index',
                routePattern: 'teaching-assignments.*',
            },
            {
                key: 'questions',
                label: 'Pertanyaan Evaluasi',
                icon: HiOutlineDocumentText,
                route: null,
            },
            {
                key: 'evaluation-periods',
                label: 'Periode Evaluasi',
                icon: HiOutlineDocumentChartBar,
                route: null,
            },
            {
                key: 'student-evaluations',
                label: 'Evaluasi Siswa',
                icon: HiOutlineAcademicCap,
                route: null,
            },
        ],
    },
    {
        key: 'analitik-laporan',
        label: 'Analitik & Laporan',
        items: [
            {
                key: 'analytics',
                label: 'Analitik',
                icon: HiOutlineChartBar,
                route: null,
            },
            {
                key: 'teacher-ranking',
                label: 'Peringkat Guru',
                icon: HiOutlineTrophy,
                route: null,
            },
            {
                key: 'student-monitoring',
                label: 'Pemantauan Siswa',
                icon: HiOutlineUsers,
                route: null,
            },
            {
                key: 'report-teacher',
                label: 'Laporan Guru',
                icon: HiOutlineDocumentText,
                route: null,
            },
            {
                key: 'report-class',
                label: 'Laporan Kelas',
                icon: HiOutlineDocumentText,
                route: null,
            },
            {
                key: 'report-subject',
                label: 'Laporan Mata Pelajaran',
                icon: HiOutlineDocumentText,
                route: null,
            },
            {
                key: 'report-category',
                label: 'Laporan Kategori',
                icon: HiOutlineDocumentText,
                route: null,
            },
            {
                key: 'report-evaluation-period',
                label: 'Laporan Periode Evaluasi',
                icon: HiOutlineDocumentText,
                route: null,
            },
        ],
    },
    {
        key: 'import-ekspor',
        label: 'Import & Ekspor',
        items: [
            {
                key: 'import-excel',
                label: 'Import Data Excel',
                icon: HiOutlineDocumentArrowUp,
                route: null,
            },
            {
                key: 'export-excel',
                label: 'Ekspor Excel',
                icon: HiOutlineDocumentArrowDown,
                route: null,
            },
            {
                key: 'export-pdf',
                label: 'Ekspor PDF',
                icon: HiOutlineDocumentArrowDown,
                route: null,
            },
        ],
    },
    {
        key: 'sistem',
        label: 'Sistem',
        items: [
            {
                key: 'notifications',
                label: 'Notifikasi',
                icon: HiOutlineBell,
                route: null,
            },
            {
                key: 'audit-logs',
                label: 'Log Audit',
                icon: HiOutlineShieldCheck,
                route: null,
            },
            {
                key: 'system-settings',
                label: 'Pengaturan Sistem',
                icon: HiOutlineCog6Tooth,
                route: null,
            },
        ],
    },
];
