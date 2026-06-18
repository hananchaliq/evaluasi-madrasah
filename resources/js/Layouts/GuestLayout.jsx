import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#0b111e] overflow-hidden selection:bg-emerald-500 selection:text-white">
            {/* BACKGROUND SVG LARAVEL - Diubah filternya menjadi Hijau & Gelap via Tailwind */}
            <img
                id="background"
                className="absolute -left-20 top-0 max-w-[877px] opacity-70 pointer-events-none hue-rotate-[95deg] saturate-[1.5] brightness-[0.7]"
                src="https://laravel.com/assets/img/welcome/background.svg"
                alt="Background Gelap Hijau"
            />

            {/* HEADER: LOGO & JUDUL */}
            <div className="z-10 flex flex-col items-center mb-4 text-center px-4">
                <Link
                    href="/"
                    className="flex flex-col items-center gap-3 group"
                >
                    {/* Menggunakan ApplicationLogo pesanan Anda */}
                    <ApplicationLogo className="h-16 w-auto fill-current text-emerald-400 drop-shadow-[0_4px_12px_rgba(52,211,153,0.3)] transition-transform group-hover:scale-105 duration-300" />

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide drop-shadow-md">
                            Sistem Evaluasi Pembelajaran Madrasah
                        </h1>
                        <p className="text-sm text-emerald-400 font-medium uppercase tracking-wider mt-1">
                            MAKN Ende
                        </p>
                    </div>
                </Link>
            </div>

            {/* CONTAINER FORM - PUTIH BERSIH (Kontras dengan Background Gelap) */}
            <div className="z-10 w-full sm:max-w-md mt-4 px-8 py-8 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden sm:rounded-2xl transition-all duration-300">
                {children}
            </div>

            {/* FOOTER */}
            <div className="z-10 mt-8 text-center">
                <p className="text-xs text-slate-400/80">
                    © 2026 Madrasah Aliyah Kejuruan Negeri Ende
                </p>
            </div>
        </div>
    );
}
