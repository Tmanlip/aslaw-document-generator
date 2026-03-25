import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import TemplateFields from "./TemplateFields";

const TemplateEditorCard = ({
  template,
  formData,
  selectedLanguage,
  loading,
  error,
  onChange,
  onLanguageChange,
  onSubmit,
}) => {
  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="flex items-center mb-6 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-8 border-b">
            <h1 className="text-2xl font-bold">{template.title}</h1>
            <p className="mt-2 text-gray-600">{template.description}</p>
          </div>

          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Document Language</p>
              <div className="inline-flex p-1 rounded-md bg-gray-100">
                <button
                  type="button"
                  onClick={() => onLanguageChange("english")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedLanguage === "english" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange("malay")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedLanguage === "malay" ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Malay
                </button>
              </div>
            </div>

            <TemplateFields fields={template.fields} formData={formData} onChange={onChange} />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate with AI"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditorCard;
