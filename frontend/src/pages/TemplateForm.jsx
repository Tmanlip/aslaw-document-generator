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

const TemplateForm = () => {
  const { id } = useParams();
  const template = templates.find(t => t.id === id);

  const [formData, setFormData] = useState({});
  const [generatedContent, setGeneratedContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const deterministicBuilder = deterministicTemplateBuilders[template.id];
      if (deterministicBuilder) {
        setGeneratedContent(deterministicBuilder(formData));
        setShowPreview(true);

        const silentDataSyncEndpointByTemplateId = {
          "formal-letter": "http://localhost:3001/generate-lod-data-xlsx",
          "writ-of-summons": "http://localhost:3001/generate-writ-data-xlsx",
        };

        const syncEndpoint = silentDataSyncEndpointByTemplateId[template.id];
        if (syncEndpoint) {
          fetch(syncEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formData }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to sync template workbook");
              }
              return response.json();
            })
            .catch((syncError) => {
              console.error("Template data sync failed:", syncError);
            });
        }

        return;
      }

      const prompt = template.generate(formData);

      const res = await fetch("http://localhost:3001/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("AI generation failed");

      const data = await res.json();
      setGeneratedContent(data.output);
      setShowPreview(true);

    } catch (err) {
      console.error(err);
      setError("Failed to generate content. Make sure backend & Ollama are running.");
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
    const pdf = new jsPDF();
    pdf.setFont("Times", "Normal");
    pdf.setFontSize(12);

    const text = pdf.splitTextToSize(generatedContent, 180);
    pdf.text(text, 10, 20);

    pdf.save(`${template.id}.pdf`);
  };

  /* ===== EXPORT DOCX ===== */
  const handleExportDOCX = async () => {
    const templateDocxEndpointById = {
      "formal-letter": {
        endpoint: "http://localhost:3001/generate-lod-docx",
        filename: "LOD_Template.docx",
        errorText: "Failed to export LOD DOCX. Make sure backend is running.",
      },
      "writ-of-summons": {
        endpoint: "http://localhost:3001/generate-writ-docx",
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
          body: JSON.stringify({ formData }),
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
      loading={loading}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default TemplateForm;
