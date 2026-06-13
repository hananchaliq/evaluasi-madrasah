import SecondaryButton from '@/Components/SecondaryButton';
import { HiOutlinePrinter } from 'react-icons/hi2';

export default function ReportActions() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="no-print flex flex-wrap gap-2">
            <SecondaryButton
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2"
            >
                <HiOutlinePrinter className="h-4 w-4" />
                Cetak Laporan
            </SecondaryButton>
        </div>
    );
}
