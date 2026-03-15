import React from "react";
import { ArrowLeft, Copy, Check, FileText, FileDown } from "lucide-react";

const TemplatePreviewCard = ({
  copied,
  onBackToEdit,
  onCopy,
  onExportPDF,
  onExportDOCX,
  children,
}) => {
  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBackToEdit}
          className="flex items-center mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to edit
        </button>

        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Generated Result</h2>

            <div className="flex gap-2">
              <button
                onClick={onCopy}
                className="flex items-center px-3 py-2 text-sm text-white bg-blue-600 rounded-md"
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                onClick={onExportPDF}
                className="flex items-center px-3 py-2 text-sm text-white bg-green-600 rounded-md"
              >
                <FileDown className="w-4 h-4 mr-1" />
                PDF
              </button>

              <button
                onClick={onExportDOCX}
                className="flex items-center px-3 py-2 text-sm text-white bg-purple-600 rounded-md"
              >
                <FileText className="w-4 h-4 mr-1" />
                DOCX
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-50">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewCard;
