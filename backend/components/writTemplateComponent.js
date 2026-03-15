import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeText = (value, fallback = "") => {
  const text = `${value ?? ""}`.trim();
  return text || fallback;
};

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const columnIndexToLetters = (index) => {
  let value = index;
  let letters = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    value = Math.floor((value - 1) / 26);
  }

  return letters;
};

const resolveWritTemplatePath = async (fileNames) => {
  const baseDir = path.resolve(__dirname, "..", "..", "template", "WritOfSummons");
  for (const name of fileNames) {
    const candidate = path.join(baseDir, name);
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(`Writ template file not found. Tried: ${fileNames.join(", ")}`);
};

const buildWritVariables = (formData = {}) => ({
  Date: normalizeText(formData.Date, ""),
  CourtName: normalizeText(formData.CourtName, ""),
  CourtLocation: normalizeText(formData.CourtLocation, ""),
  CaseNumber: normalizeText(formData.CaseNumber, ""),
  PlaintiffName: normalizeText(formData.PlaintiffName, ""),
  PlaintiffNRIC: normalizeText(formData.PlaintiffNRIC, ""),
  PlaintiffAddressLine1: normalizeText(formData.PlaintiffAddressLine1, ""),
  PlaintiffAddressLine2: normalizeText(formData.PlaintiffAddressLine2, ""),
  DefendantName: normalizeText(formData.DefendantName, ""),
  DefendantNRIC: normalizeText(formData.DefendantNRIC, ""),
  DefendantAddressLine1: normalizeText(formData.DefendantAddressLine1, ""),
  DefendantAddressLine2: normalizeText(formData.DefendantAddressLine2, ""),
  ClaimAmount: normalizeText(formData.ClaimAmount, ""),
  Currency: normalizeText(formData.Currency, ""),
  ClaimDescription: normalizeText(formData.ClaimDescription, ""),
  ContractDate: normalizeText(formData.ContractDate, ""),
  BreachDetails: normalizeText(formData.BreachDetails, ""),
  InterestRate: normalizeText(formData.InterestRate, ""),
  CostsAmount: normalizeText(formData.CostsAmount, ""),
  LawyerName: normalizeText(formData.LawyerName, ""),
  LawFirmName: normalizeText(formData.LawFirmName, ""),
  LawFirmAddress: normalizeText(formData.LawFirmAddress, ""),
  LawyerPhone: normalizeText(formData.LawyerPhone, ""),
  LawyerEmail: normalizeText(formData.LawyerEmail, ""),
  AppearanceDays: normalizeText(formData.AppearanceDays, ""),
  HearingDate: normalizeText(formData.HearingDate, ""),
  CourtSealReference: normalizeText(formData.CourtSealReference, ""),
});

const generateWritDocxBuffer = async (formData = {}) => {
  const templatePath = await resolveWritTemplatePath([
    "Writ_of_Summons_Template.docx",
    "Writ_of_Summons_template.docx",
    "writ_of_summons_template.docx",
  ]);
  const templateBuffer = await fs.readFile(templatePath);
  const zip = await JSZip.loadAsync(templateBuffer);

  const documentEntry = Object.keys(zip.files).find((key) =>
    /(^|[\\/])word[\\/]document\.xml$/i.test(key),
  );

  if (!documentEntry) {
    throw new Error("word/document.xml not found in DOCX template");
  }

  let documentXml = await zip.file(documentEntry).async("string");
  const variables = buildWritVariables(formData);

  Object.entries(variables).forEach(([key, value]) => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const tokenRegex = new RegExp(`\\{\\{\\s*${escapedKey}\\s*\\}\\}`, "g");
    documentXml = documentXml.replace(tokenRegex, escapeXml(value));
  });

  zip.file(documentEntry, documentXml);
  return zip.generateAsync({ type: "nodebuffer" });
};

const generateWritDataWorkbook = async (formData = {}) => {
  const templatePath = await resolveWritTemplatePath([
    "Writ_of_Summons_Data_new.xlsx",
    "Writ_of_Summons_Data.xlsx",
    "Writ_of_Summons_Data_v1.xlsx",
  ]);
  const outputPath = path.resolve(
    __dirname,
    "..",
    "..",
    "template",
    "WritOfSummons",
    "Writ_of_Summons_Data_filled.xlsx",
  );

  const templateBuffer = await fs.readFile(templatePath);
  const zip = await JSZip.loadAsync(templateBuffer);
  const sheetEntry = Object.keys(zip.files).find((key) =>
    /(^|[\\/])xl[\\/]worksheets[\\/]sheet1\.xml$/i.test(key),
  );

  if (!sheetEntry) {
    throw new Error("xl/worksheets/sheet1.xml not found in XLSX template");
  }

  let sheetXml = await zip.file(sheetEntry).async("string");

  const writColumns = [
    "Date",
    "CourtName",
    "CourtLocation",
    "CaseNumber",
    "PlaintiffName",
    "PlaintiffNRIC",
    "PlaintiffAddressLine1",
    "PlaintiffAddressLine2",
    "DefendantName",
    "DefendantNRIC",
    "DefendantAddressLine1",
    "DefendantAddressLine2",
    "ClaimAmount",
    "Currency",
    "ClaimDescription",
    "ContractDate",
    "BreachDetails",
    "InterestRate",
    "CostsAmount",
    "LawyerName",
    "LawFirmName",
    "LawFirmAddress",
    "LawyerPhone",
    "LawyerEmail",
    "AppearanceDays",
    "HearingDate",
    "CourtSealReference",
  ];

  const values = buildWritVariables(formData);
  const row2Xml = `<row r="2">${writColumns
    .map((columnName, index) => {
      const cellRef = `${columnIndexToLetters(index + 1)}2`;
      const value = escapeXml(values[columnName] || "");
      return `<c r="${cellRef}" t="inlineStr"><is><t xml:space="preserve">${value}</t></is></c>`;
    })
    .join("")}</row>`;

  if (sheetXml.includes("<row r=\"2\"")) {
    sheetXml = sheetXml.replace(/<row r="2"[^>]*>[\s\S]*?<\/row>/, row2Xml);
  } else {
    sheetXml = sheetXml.replace("</sheetData>", `${row2Xml}</sheetData>`);
  }

  zip.file(sheetEntry, sheetXml);
  const outputBuffer = await zip.generateAsync({ type: "nodebuffer" });
  await fs.writeFile(outputPath, outputBuffer);

  return outputPath;
};

export const registerWritTemplateRoutes = (app) => {
  app.post("/generate-writ-docx", async (req, res) => {
    try {
      const formData = req.body?.formData || {};
      const outputBuffer = await generateWritDocxBuffer(formData);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="Writ_of_Summons_Template.docx"',
      );
      res.send(outputBuffer);
    } catch (error) {
      console.error("Writ DOCX generation failed:", error);
      res.status(500).json({ error: "Failed to generate Writ DOCX" });
    }
  });

  app.post("/generate-writ-data-xlsx", async (req, res) => {
    try {
      const formData = req.body?.formData || {};
      const outputPath = await generateWritDataWorkbook(formData);

      res.json({
        success: true,
        message: "Writ data workbook updated",
        path: outputPath,
      });
    } catch (error) {
      console.error("Writ XLSX generation failed:", error);
      res.status(500).json({ error: "Failed to generate Writ XLSX" });
    }
  });
};
