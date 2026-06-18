import {
    HiOutlineAcademicCap,
    HiOutlineChartBar,
    HiOutlineClipboardDocumentList,
    HiOutlineDocumentChartBar,
    HiOutlineDocumentText,
    HiOutlineHome,
    HiOutlineQueueList,
    HiOutlineTableCells,
    HiOutlineUserGroup,
    HiOutlineUsers,
    HiOutlineShieldCheck,
    HiOutlineBell,
    HiOutlineCog6Tooth,
    HiOutlineDocumentArrowDown,
    HiOutlineTrophy,
    HiOutlineBookOpen
} from "react-icons/hi2";

export const adminNavigation = [
    {
        key: "utama",
        label: "Utama",
        items: [
            {
                key: "dashboard",
                label: "Beranda",
                icon: HiOutlineHome,
                route: "admin.dashboard",
            },
        ],
    },
    {
        key: "evaluasi",
        label: "Evaluasi",
        items: [
            {
                key: "evaluation-monitoring",
                label: "Pemantauan Evaluasi",
                icon: HiOutlineChartBar,
                route: "admin.evaluation-monitoring.index",
                routePattern: "admin.evaluation-monitoring.*",
            },
            {
                key: "teaching-assignments",
                label: "Penugasan Mengajar",
                icon: HiOutlineClipboardDocumentList,
                route: "admin.teaching-assignments.index",
                routePattern: "admin.teaching-assignments.*",
            },
            {
                key: "questions",
                label: "Pertanyaan Evaluasi",
                icon: HiOutlineDocumentText,
                route: "admin.questions.index",
                routePattern: "admin.questions.*",
            },
            {
                key: "evaluation-periods",
                label: "Periode Evaluasi",
                icon: HiOutlineDocumentChartBar,
                route: "admin.evaluation-periods.index",
                routePattern: "admin.evaluation-periods.*",
            },
        ],
    },
    {
        key: "data-master",
        label: "Data Master",
        items: [
            {
                key: "tingkatans",
                label: "Tingkatan",
                icon: HiOutlineQueueList,
                route: "admin.tingkatans.index",
                routePattern: "admin.tingkatans.*",
            },
            {
                key: "kelas",
                label: "Kelas",
                icon: HiOutlineAcademicCap,
                route: "admin.kelas.index",
                routePattern: "admin.kelas.*",
            },
            {
                key: "subject-categories",
                label: "Kategori Mata Pelajaran",
                icon: HiOutlineTableCells,
                route: "admin.subject-categories.index",
                routePattern: "admin.subject-categories.*",
            },
            {
                key: "subjects",
                label: "Mata Pelajaran",
                icon: HiOutlineBookOpen,
                route: "admin.subjects.index",
                routePattern: "admin.subjects.*",
            },
            {
                key: "teachers",
                label: "Guru",
                icon: HiOutlineUserGroup,
                route: "admin.teachers.index",
                routePattern: "admin.teachers.*",
            },
            {
                key: "students",
                label: "Siswa",
                icon: HiOutlineUsers,
                route: "admin.students.index",
                routePattern: "admin.students.*",
            }
        ],
    },
    {
        key: "analitik-laporan",
        label: "Analitik & Laporan",
        items: [
            {
                key: "analytics",
                label: "Analitik",
                icon: HiOutlineChartBar,
                route: "admin.analytics.index",
                routePattern: "admin.analytics.*",
            },
            {
                key: "teacher-ranking",
                label: "Peringkat Guru",
                icon: HiOutlineTrophy,
                route: "admin.teacher-rankings.index",
                routePattern: "admin.teacher-rankings.*",
            },
            {
                key: "report-teacher",
                label: "Laporan Guru",
                icon: HiOutlineDocumentText,
                route: "admin.reports.teacher",
                routePattern: "admin.reports.teacher",
            },
            {
                key: "report-class",
                label: "Laporan Kelas",
                icon: HiOutlineDocumentText,
                route: "admin.reports.class",
                routePattern: "admin.reports.class",
            }
        ],
    },
    {
        key: "sistem",
        label: "Sistem",
        items: [
            {
                key: "audit-logs",
                label: "Log Audit",
                icon: HiOutlineShieldCheck,
                route: "admin.audit-logs.index",
                routePattern: "admin.audit-logs.*",
            }
        ],
    },
];

export const studentNavigation = [
    {
        key: "utama",
        label: "Utama",
        items: [
            {
                key: "dashboard",
                label: "Beranda",
                icon: HiOutlineHome,
                route: "student.dashboard",
            },
            {
                key: "fill-evaluation",
                label: "Isi Evaluasi",
                icon: HiOutlineAcademicCap,
                route: "student.dashboard",
            },
        ],
    },
];

export const teacherNavigation = [
    {
        key: "utama",
        label: "Utama",
        items: [
            {
                key: "dashboard",
                label: "Beranda",
                icon: HiOutlineHome,
                route: "teacher.dashboard",
            },
            {
                key: "results",
                label: "Hasil Evaluasi",
                icon: HiOutlineChartBar,
                route: "teacher.evaluation-results.index",
            },
        ],
    },
];
