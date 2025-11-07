import { FileText, Download } from "lucide-react";

const ResultDisplay = ({ pdfUrl }) => {
return (
    <div className="p-8 bg-white rounded-xl shadow-md border border-gray-200 text-center">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Summary Ready!</h2>
    <p className="text-gray-500 mb-6">
        Your summarized PDF is ready for download.
    </p>

    <div className="flex flex-col items-center justify-center gap-4">
        <FileText className="w-12 h-12 text-indigo-600" />
        <a
        href={pdfUrl}
        download
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
        >
        <Download className="w-5 h-5" />
        Download PDF
        </a>
    </div>
    </div>
);
};

export default ResultDisplay;
