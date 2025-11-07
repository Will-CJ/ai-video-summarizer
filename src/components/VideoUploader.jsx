import { useState } from "react";
import { Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

const VideoUploader = ({ onProcessingComplete }) => {
const [youtubeUrl, setYoutubeUrl] = useState("");
const [loading, setLoading] = useState(false);
const [alert, setAlert] = useState("");

const showAlert = (message) => {
    setAlert(message);
    setTimeout(() => setAlert(""), 4000);
};

const handleSubmit = async () => {
    if (!youtubeUrl.trim()) {
    showAlert("Please enter a YouTube link!");
    return;
    }

    setLoading(true);
    const YT_WEBHOOK = import.meta.env.VITE_N8N_YOUTUBE_WEBHOOK;

    try {
    const res = await fetch(YT_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
    });

    if (!res.ok) throw new Error("Webhook request failed");
    const data = await res.json();

    const html = data.html || marked.parse(data.markdown || "");
    const styledHtml = `
        <html>
        <head>
            <style>
            body {
                font-family: 'Inter', Arial, sans-serif;
                line-height: 1.6;
                color: #222;
                padding: 2rem;
            }
            h1, h2, h3 {
                color: #1e293b;
                margin-bottom: 0.5rem;
            }
            h1 { font-size: 1.8rem; border-bottom: 2px solid #6366f1; padding-bottom: 0.3rem; }
            h2 { font-size: 1.4rem; margin-top: 1.2rem; color: #374151; }
            p, li { font-size: 0.95rem; }
            ul, ol {
                padding-left: 1.5rem;
                margin-bottom: 1rem;
            }
            ul { list-style-type: disc; }
            ol { list-style-type: decimal; }
            li { margin-bottom: 0.4rem; }
            strong { color: #111827; }
            code {
                background: #f3f4f6;
                padding: 2px 5px;
                border-radius: 4px;
                font-family: monospace;
            }
            </style>
        </head>
        <body>${html}</body>
        </html>
    `;

    const opt = {
        margin: [10, 10, 10, 10],
        filename: "summary.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const pdfBlob = await html2pdf().set(opt).from(styledHtml).outputPdf("blob");
    const pdfObjectUrl = URL.createObjectURL(pdfBlob);
    onProcessingComplete(pdfObjectUrl);
    } catch (err) {
    console.error(err);
    showAlert("Failed to process video. Please try again.");
    } finally {
    setLoading(false);
    }
};

return (
    <div className="p-8 bg-white rounded-xl shadow-md border border-gray-200 text-center">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Summarize YouTube Video</h2>
    <p className="text-gray-500 mb-6">
        Paste a YouTube link below to generate a summarized PDF of the content.
    </p>

    {/* Custom Alert */}
    {alert && (
        <div className="mb-4 flex items-center justify-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <span>{alert}</span>
        </div>
    )}

    {/* YouTube Link Input */}
    <input
        type="url"
        placeholder="Enter YouTube video link"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
    />

    {/* Submit Button */}
    <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-4 px-6 py-3 rounded-lg text-white font-medium transition ${
        loading
            ? "bg-indigo-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
    >
        {loading ? (
        <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
        </span>
        ) : (
        <span className="flex items-center justify-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Summarize YouTube Video
        </span>
        )}
    </button>
    </div>
);
};

export default VideoUploader;
