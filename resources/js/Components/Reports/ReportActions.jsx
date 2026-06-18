import SecondaryButton from '@/Components/SecondaryButton';
import { HiOutlineDocumentArrowDown, HiOutlinePrinter } from 'react-icons/hi2';

export default function ReportActions({ report, filters, search }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const queryParams = new URLSearchParams();
        
        // Add filters to query params
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        // Add search parameter if present
        if (search) {
            queryParams.append('search', search);
        }

        // The PDF route is the base route + .pdf (as defined in web.php)
        const pdfRouteName = `${report.routeName}.pdf`;
        window.open(route(pdfRouteName) + '?' + queryParams.toString(), '_blank');
    };

    return (
        <div className="no-print flex flex-wrap gap-2">
            <SecondaryButton
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
                <HiOutlineDocumentArrowDown className="h-4 w-4" />
                Unduh PDF
            </SecondaryButton>
            
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
