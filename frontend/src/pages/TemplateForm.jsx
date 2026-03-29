import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { templates } from "../data/templates";
import { deterministicTemplateBuilders } from "../components/templates/builders";
import { renderGeneratedPreview } from "../components/templates/previews/renderGeneratedPreview";
import TemplateEditorCard from "../components/templates/ui/TemplateEditorCard";
import TemplatePreviewCard from "../components/templates/ui/TemplatePreviewCard";

import jsPDF from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

const TemplateForm = () => {
  const { id } = useParams();
  const template = templates.find(t => t.id === id);

  const [formData, setFormData] = useState({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [syncStatusMessage, setSyncStatusMessage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  // Initialize form data
  useEffect(() => {
    if (template) {
      const initialData = {};
      template.fields.forEach(field => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
  }, [template]);

  if (!template) {
    return (
      <div className="p-8 text-center">
        Template not found.{" "}
        <Link to="/" className="text-blue-600">Go Home</Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const syncTemplateWorkbook = async (endpointPath, payload) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}${endpointPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // This sync is optional and should not interrupt user flow.
        return false;
      }

      await response.json();
      return true;
    } catch {
      // Ignore connection issues for optional background sync.
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSyncStatusMessage("");

    try {
      const deterministicBuilder = deterministicTemplateBuilders[template.id];
      if (deterministicBuilder) {
        setGeneratedContent(deterministicBuilder(formData, selectedLanguage));
        setShowPreview(true);

        const silentDataSyncEndpointByTemplateId = {
          "formal-letter": "/generate-lod-data-xlsx",
          "writ-of-summons": "/generate-writ-data-xlsx",
        };

        const syncEndpoint = silentDataSyncEndpointByTemplateId[template.id];
        if (syncEndpoint) {
          void syncTemplateWorkbook(syncEndpoint, { formData }).then((syncSuccess) => {
            if (!syncSuccess) {
              setSyncStatusMessage("Workbook sync is unavailable right now. Continue using preview/export as usual.");
            }
          });
        }

        return;
      }

      const languageInstruction = selectedLanguage === "malay"
        ? "Write the output in formal Malay (Bahasa Melayu) with professional grammar and vocabulary."
        : "Write the output in formal English with professional grammar and vocabulary.";

      const prompt = `${template.generate(formData)}\n\n${languageInstruction}\nMaintain a professional and formal tone throughout.`;

      const res = await fetch(`${BACKEND_BASE_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language: selectedLanguage }),
      });

      if (!res.ok) {
        let backendError = "AI generation failed";
        try {
          const errorPayload = await res.json();
          if (errorPayload?.error) {
            backendError = errorPayload.error;
          }
        } catch {
          // Use fallback message when response body is not JSON.
        }

        throw new Error(backendError);
      }

      const data = await res.json();
      setGeneratedContent(data.output);
      setShowPreview(true);

    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to generate content. Make sure backend & Ollama are running.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ===== EXPORT PDF ===== */
  const handleExportPDF = () => {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFont("Times", "Normal");
    pdf.setFontSize(12);

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 6;
    const maxLineWidth = pageWidth - (margin * 2);
    const maxY = pageHeight - margin;

    const paragraphs = generatedContent.split("\n");
    let cursorY = margin;

    paragraphs.forEach((paragraph, paragraphIndex) => {
      const lines = paragraph.trim().length > 0
        ? pdf.splitTextToSize(paragraph, maxLineWidth)
        : [""];

      lines.forEach((line) => {
        if (cursorY > maxY) {
          pdf.addPage();
          cursorY = margin;
        }

        pdf.text(line, margin, cursorY);
        cursorY += lineHeight;
      });

      if (paragraphIndex < paragraphs.length - 1) {
        if (cursorY > maxY) {
          pdf.addPage();
          cursorY = margin;
        } else {
          cursorY += lineHeight;
        }
      }
    });

    pdf.save(`${template.id}.pdf`);
  };

  /* ===== EXPORT DOCX ===== */
  const handleExportDOCX = async () => {
    const templateDocxEndpointById = {
      "formal-letter": {
        endpoint: `${BACKEND_BASE_URL}/generate-lod-docx`,
        filename: "LOD_Template.docx",
        errorText: "Failed to export LOD DOCX. Make sure backend is running.",
      },
      "writ-of-summons": {
        endpoint: `${BACKEND_BASE_URL}/generate-writ-docx`,
        filename: "Writ_of_Summons_Template.docx",
        errorText: "Failed to export Writ DOCX. Make sure backend is running.",
      },
    };

    const templateDocxConfig = templateDocxEndpointById[template.id];
    if (templateDocxConfig) {
      try {
        const response = await fetch(templateDocxConfig.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData, language: selectedLanguage }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate template DOCX");
        }

        const blob = await response.blob();
        saveAs(blob, templateDocxConfig.filename);
      } catch (err) {
        console.error(err);
        setError(templateDocxConfig.errorText);
      }

      return;
    }

    const doc = new Document({
      sections: [
        {
          children: generatedContent
            .split("\n")
            .map(line => new Paragraph(line)),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${template.id}.docx`);
  };

  /* ================= PREVIEW ================= */
  if (showPreview) {
    return (
      <TemplatePreviewCard
        copied={copied}
        onBackToEdit={() => setShowPreview(false)}
        onCopy={handleCopy}
        onExportPDF={handleExportPDF}
        onExportDOCX={handleExportDOCX}
        syncStatusMessage={syncStatusMessage}
      >
        {renderGeneratedPreview(template.id, generatedContent)}
      </TemplatePreviewCard>
    );
  }

  /* ================= FORM ================= */
  return (
    <TemplateEditorCard
      template={template}
      formData={formData}
      selectedLanguage={selectedLanguage}
      loading={loading}
      error={error}
      onChange={handleChange}
      onLanguageChange={setSelectedLanguage}
      onSubmit={handleSubmit}
    />
  );
};

export default TemplateForm;
