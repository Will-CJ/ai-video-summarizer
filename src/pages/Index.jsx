import { useState } from "react";
import { Sparkles, FileVideo, Brain, FileText } from "lucide-react";
import VideoUploader from "../components/VideoUploader";
import ResultDisplay from "../components/ResultDisplay";

const Index = () => {
  const [pdfUrl, setPdfUrl] = useState(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Learning Assistant
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent leading-tight pb-1">
            Video Learning Summarizer
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform lengthy videos into concise, actionable PDF summaries.
            Perfect for lectures, tutorials, and educational content.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-md">
              <FileVideo className="h-4 w-4 text-indigo-500" />
              <span className="text-sm text-gray-700">Upload or YouTube</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-md">
              <Brain className="h-4 w-4 text-indigo-500" />
              <span className="text-sm text-gray-700">AI Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-md">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span className="text-sm text-gray-700">PDF Summary</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <VideoUploader onProcessingComplete={setPdfUrl} />
          {pdfUrl && <ResultDisplay pdfUrl={pdfUrl} />}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Built with React + n8n + Gemini API
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
