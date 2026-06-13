import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { HiOutlineCheckCircle, HiOutlineXMark } from 'react-icons/hi2';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }

        setVisible(false);
    }, [flash?.success, flash?.error]);

    if (!visible || (!flash?.success && !flash?.error)) {
        return null;
    }

    const isSuccess = Boolean(flash.success);
    const message = flash.success || flash.error;

    return (
        <div
            className={`mb-6 flex items-start justify-between gap-3 rounded-lg border px-4 py-3 ${
                isSuccess
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800'
            }`}
            role="alert"
        >
            <div className="flex items-start gap-3">
                {isSuccess && (
                    <HiOutlineCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                )}
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                type="button"
                onClick={() => setVisible(false)}
                className={`shrink-0 rounded p-1 transition ${
                    isSuccess
                        ? 'text-emerald-600 hover:bg-emerald-100'
                        : 'text-red-600 hover:bg-red-100'
                }`}
                aria-label="Tutup pesan"
            >
                <HiOutlineXMark className="h-4 w-4" />
            </button>
        </div>
    );
}
