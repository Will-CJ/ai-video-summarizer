import { useState } from "react";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { marked } from "marked";
import html2pdf from "html2pdf.js";

const VideoUploader = ({ onProcessingComplete }) => {
const [mode, setMode] = useState("upload"); // "upload" or "youtube"
const [file, setFile] = useState(null);
const [youtubeUrl, setYoutubeUrl] = useState("");
const [loading, setLoading] = useState(false);

const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};

const handleSubmit = async () => {
    setLoading(true);

    const FILE_WEBHOOK = import.meta.env.VITE_N8N_FILE_WEBHOOK;
    const YT_WEBHOOK = import.meta.env.VITE_N8N_YOUTUBE_WEBHOOK;

    try {
        let res;
        if (mode === "upload") {
            if (!file) return alert("Please upload a video first!");

            const formData = new FormData();
            formData.append("file", file);

            res = await fetch(FILE_WEBHOOK, {
            method: "POST",
            body: formData,
            });
        } else {
            if (!youtubeUrl.trim()) return alert("Please enter a YouTube link!");

            res = await fetch(YT_WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ youtubeUrl }),
            });
        }

        const data = await res.json();
        console.log(data)
        const html = data.html || marked.parse(data.markdown || "");

        // Wrap HTML with basic styles for a clean PDF
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
                p, li {
                    font-size: 0.95rem;
                }
                ul {
                    list-style-type: disc;   /* ✅ ensures bullet points show up */
                    padding-left: 1.5rem;    /* ✅ adds space for bullets */
                    margin-bottom: 1rem;
                }
                ol {
                    list-style-type: decimal; /* ✅ for numbered lists */
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                li {
                    margin-bottom: 0.4rem;
                }
                strong {
                    color: #111827;
                }
                code {
                    background: #f3f4f6;
                    padding: 2px 5px;
                    border-radius: 4px;
                    font-family: monospace;
                }
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        const opt = {
        margin: [10, 10, 10, 10],
        filename: 'summary.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        const pdfBlob = await html2pdf().set(opt).from(styledHtml).outputPdf('blob');

        const pdfObjectUrl = URL.createObjectURL(pdfBlob);
        onProcessingComplete(pdfObjectUrl);
    } catch (err) {
        console.error(err);
        alert("Failed to process video. Please try again.");
    } finally {
        setLoading(false);
    }
};

return (
    <div className="p-8 bg-white rounded-xl shadow-md border border-gray-200 text-center">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upload or Link Video</h2>
    <p className="text-gray-500 mb-6">
        Choose how you want to provide your video — upload an MP4 or paste a YouTube link.
    </p>

    {/* Tabs */}
    <div className="flex justify-center mb-6">
        <button
        className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            mode === "upload"
            ? "border-indigo-600 text-indigo-600"
            : "border-transparent text-gray-500 hover:text-indigo-600"
        }`}
        onClick={() => setMode("upload")}
        >
        Upload MP4
        </button>
        <button
        className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            mode === "youtube"
            ? "border-indigo-600 text-indigo-600"
            : "border-transparent text-gray-500 hover:text-indigo-600"
        }`}
        onClick={() => setMode("youtube")}
        >
        YouTube Link
        </button>
    </div>

    {/* Upload Mode */}
    {mode === "upload" && (
        <div className="space-y-4">
        <input
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
        />
        </div>
    )}

    {/* YouTube Mode */}
    {mode === "youtube" && (
        <div className="space-y-4">
        <input
            type="url"
            placeholder="Enter YouTube video link"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        </div>
    )}

    {/* Submit Button */}
    <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-6 px-6 py-3 rounded-lg text-white font-medium transition ${
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
        ) : mode === "upload" ? (
        <span className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Upload & Summarize
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
