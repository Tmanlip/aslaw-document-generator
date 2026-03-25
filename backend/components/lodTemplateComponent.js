import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const lodTemplateDir = path.resolve(__dirname, "..", "..", "template", "LOD");

const lodFallback = {
  Date: "8 Mar 2026",
  YourCompanyName: "ABC Sdn Bhd",
  YourCompanyAddressLine1: "Level 10, Menara Example",
  YourCompanyAddressLine2: "Kuala Lumpur 50000, Malaysia",
  YourCompanyPhone: "03-1234 5678",
  YourCompanyEmail: "accounts@abc.com",
  RecipientName: "John Tan",
  RecipientCompanyName: "Tan Trading",
  RecipientAddressLine1: "12, Jalan Damai",
  RecipientAddressLine2: "Kuala Lumpur 50450",
  RecipientSalutation: "Mr Tan",
  Reference: "INV-2025-0042",
  Currency: "RM",
  AmountDue: "12,500.00",
  GoodsOrServices: "IT support services (Jan 2026)",
  AgreementType: "Service Agreement",
  AgreementDate: "1 Jan 2026",
  InvoiceNumber: "INV-2026-00088",
  DueDate: "31 Jan 2026",
  ReminderDates: "14 Feb 2026; 28 Feb 2026",
  PaymentWindowDays: "7",
  FinalPaymentDate: "15 Mar 2026",
  PaymentInstructions:
    "ABC Sdn Bhd - Maybank 5123 4567 890 (Please state invoice no.)",
  RemittanceEmail: "remittance@abc.com",
  ContactPerson: "Aiman",
  ContactPhone: "+60 12-345 6789",
  ContactEmail: "aiman@abc.com",
  DisputeWindowDays: "3",
  YourSignerName: "Nur Aisyah",
  YourSignerTitle: "Finance Manager",
};

const lodColumnOrder = [
  "Date",
  "YourCompanyName",
  "YourCompanyAddressLine1",
  "YourCompanyAddressLine2",
  "YourCompanyPhone",
  "YourCompanyEmail",
  "RecipientName",
  "RecipientCompanyName",
  "RecipientAddressLine1",
  "RecipientAddressLine2",
  "RecipientSalutation",
  "Reference",
  "Currency",
  "AmountDue",
  "GoodsOrServices",
  "AgreementType",
  "AgreementDate",
  "InvoiceNumber",
  "DueDate",
  "ReminderDates",
  "PaymentWindowDays",
  "FinalPaymentDate",
  "PaymentInstructions",
  "RemittanceEmail",
  "ContactPerson",
  "ContactPhone",
  "ContactEmail",
  "DisputeWindowDays",
  "YourSignerName",
  "YourSignerTitle",
];

const normalizeText = (value, fallback = "") => {
  const text = `${value ?? ""}`.trim();
  return text || fallback;
};

const splitAddress = (value) => {
  const lines = `${value ?? ""}`
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return ["", ""];
  }

  if (lines.length === 1) {
    return [lines[0], ""];
  }

  return [lines[0], lines.slice(1).join(", ")];
};

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeLanguage = (language) => {
  const value = `${language ?? ""}`.trim().toLowerCase();
  return value === "malay" ? "malay" : "english";
};

const replaceAllLiteral = (source, searchValue, replacementValue) =>
  source.split(searchValue).join(replacementValue);

const localizeLodDocxXml = (xml, language) => {
  if (normalizeLanguage(language) !== "malay") {
    return xml;
  }

  const replacements = [
    ["Ref: {{subject}}", "Ruj: {{subject}}"],
    ["LETTER OF DEMAND: {{subject}}", "Ruj: {{subject}}"],
    ["Dear Sir/Madam,", "Tuan/Puan,"],
    ["Dear {{RecipientSalutation}},", "Tuan/Puan,"],
    [
      "We refer to the outstanding sum of {{Currency}} {{AmountDue}} owing to {{senderName}} for {{body}} under {{AgreementType}} dated {{AgreementDate}} (Invoice: {{InvoiceNumber}}; Due date: {{DueDate}}).",
      "Merujuk kepada perkara di atas, kami bertindak bagi pihak Anakguam kami. Adalah dimaklumkan bahawa pihak kami telah diarahkan untuk menyatakan seperti berikut: {{body}}.",
    ],
    [
      "Despite our previous reminders dated {{ReminderDates}}, the above amount remains unpaid.",
      "Penyebaran fitnah oleh pihak Tuan/Puan terhadap Anakguam kami telah menyebabkan kerugian reputasi dan perniagaan yang serius.",
    ],
    [
      "You are hereby formally required to settle the full outstanding sum within {{PaymentWindowDays}} days from the date of this letter, that is, on or before {{FinalPaymentDate}}.",
      "SILA AMBIL PERHATIAN bahawa kami menuntut pihak Tuan/Puan dalam masa {{PaymentWindowDays}} hari dari tarikh surat ini untuk memadam kenyataan fitnah, menerbitkan akujanji tidak mengulangi fitnah, mengemukakan draf permohonan maaf, dan melaksanakan penyiaran permohonan maaf setelah diluluskan.",
    ],
    [
      "Failing payment by the stipulated deadline, we reserve all rights to commence legal proceedings without further notice, and to claim all additional costs, interest, and expenses incurred.",
      "Kami turut menuntut gantirugi sebanyak {{Currency}} {{AmountDue}} dan jika pihak Tuan/Puan gagal mematuhi tuntutan ini, kami mempunyai arahan tegas Anakguam kami untuk memfailkan tindakan sivil di Mahkamah tanpa notis lanjut.",
    ],
    [
      "Payment shall be made to {{PaymentInstructions}} and remittance advice shall be emailed to {{RemittanceEmail}}. Should you dispute any part of this demand, written particulars of such dispute must be provided to {{senderName}} at {{ContactPhone}} / {{ContactEmail}} within {{DisputeWindowDays}} days.",
      "Tuntutan-tuntutan di atas dibuat tanpa prasangka terhadap hak-hak dan remedi Anakguam kami, yang kesemuanya adalah terpelihara.",
    ],
    [
      "Please arrange payment to {{PaymentInstructions}} and email the remittance advice to {{RemittanceEmail}}. If you dispute any part of this demand, contact {{senderName}} at {{ContactPhone}} / {{ContactEmail}} within {{DisputeWindowDays}} days.",
      "Sila buat pembayaran kepada {{PaymentInstructions}} dan e-melkan bukti pembayaran kepada {{RemittanceEmail}}. Sekiranya pihak tuan/puan mempertikaikan mana-mana bahagian tuntutan ini, sila hubungi {{senderName}} di {{ContactPhone}} / {{ContactEmail}} dalam tempoh {{DisputeWindowDays}} hari.",
    ],
    [
      "WITHOUT PREJUDICE. This letter is issued without prejudice to our client's rights and remedies, all of which are expressly reserved.",
      "TANPA PREJUDIS. Surat ini dikeluarkan tanpa prejudis kepada hak dan remedi pelanggan kami, yang kesemuanya adalah terpelihara.",
    ],
    [
      "WITHOUT PREJUDICE. This letter is issued without prejudice to our clientâ€™s rights and remedies, all of which are expressly reserved.",
      "TANPA PREJUDIS. Surat ini dikeluarkan tanpa prejudis kepada hak dan remedi pelanggan kami, yang kesemuanya adalah terpelihara.",
    ],
    [
      "This letter is issued without prejudice to our clientâ€™s rights and remedies, all of which are expressly reserved.",
      "Surat ini dikeluarkan tanpa prejudis kepada hak dan remedi pelanggan kami, yang kesemuanya adalah terpelihara.",
    ],
    ["Sincerely,", "Yang benar,"],
    ["Yours faithfully,", "Yang benar,"],
  ];

  return replacements.reduce(
    (localizedXml, [searchValue, replacementValue]) =>
      replaceAllLiteral(localizedXml, searchValue, replacementValue),
    xml,
  );
};

const resolveLodPath = async (candidates) => {
  for (const fileName of candidates) {
    const absolutePath = path.resolve(lodTemplateDir, fileName);

    try {
      await fs.access(absolutePath);
      return absolutePath;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(`LOD file not found. Tried: ${candidates.join(", ")}`);
};

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

const buildDefamationBodyFromForm = (formData = {}, defaultBody = "") => {
  const sections = [
    normalizeText(formData.BackgroundFacts, ""),
    normalizeText(formData.DefamationActs, ""),
    normalizeText(formData.DefamatoryStatementsDetails, ""),
    normalizeText(formData.ImageUploadDetails, ""),
    normalizeText(formData.AdditionalPublicationDetails, ""),
    normalizeText(formData.ReshareDetails, ""),
  ].filter(Boolean);

  if (sections.length === 0) {
    return defaultBody;
  }

  return sections.join("; ");
};

const buildLodVariables = (formData = {}) => {
  const pickField = (key, legacyKey, fallback) => {
    const primary = normalizeText(formData[key], "");
    if (primary) {
      return primary;
    }

    if (legacyKey) {
      const legacy = normalizeText(formData[legacyKey], "");
      if (legacy) {
        return legacy;
      }
    }

    return fallback;
  };

  const [legacySenderAddressLine1, legacySenderAddressLine2] = splitAddress(
    formData.senderAddress,
  );
  const [legacyRecipientAddressLine1, legacyRecipientAddressLine2] = splitAddress(
    formData.recipientAddress,
  );

  const fromForm = {
    Date: pickField("Date", "date", lodFallback.Date),
    YourCompanyName: pickField("YourCompanyName", "senderName", lodFallback.YourCompanyName),
    YourCompanyAddressLine1: pickField(
      "YourCompanyAddressLine1",
      null,
      normalizeText(legacySenderAddressLine1, lodFallback.YourCompanyAddressLine1),
    ),
    YourCompanyAddressLine2: pickField(
      "YourCompanyAddressLine2",
      null,
      normalizeText(legacySenderAddressLine2, lodFallback.YourCompanyAddressLine2),
    ),
    YourCompanyPhone: pickField("YourCompanyPhone", null, lodFallback.YourCompanyPhone),
    YourCompanyEmail: pickField("YourCompanyEmail", null, lodFallback.YourCompanyEmail),
    RecipientName: pickField("RecipientName", "recipientName", lodFallback.RecipientName),
    RecipientCompanyName: pickField(
      "RecipientCompanyName",
      null,
      lodFallback.RecipientCompanyName,
    ),
    RecipientAddressLine1: pickField(
      "RecipientAddressLine1",
      null,
      normalizeText(legacyRecipientAddressLine1, lodFallback.RecipientAddressLine1),
    ),
    RecipientAddressLine2: pickField(
      "RecipientAddressLine2",
      null,
      normalizeText(legacyRecipientAddressLine2, lodFallback.RecipientAddressLine2),
    ),
    RecipientSalutation: pickField(
      "RecipientSalutation",
      null,
      lodFallback.RecipientSalutation,
    ),
    Reference: pickField("Reference", "subject", lodFallback.Reference),
    Currency: pickField("Currency", null, lodFallback.Currency),
    AmountDue: pickField("AmountDue", null, lodFallback.AmountDue),
    GoodsOrServices: pickField("GoodsOrServices", "body", lodFallback.GoodsOrServices),
    AgreementType: pickField("AgreementType", null, lodFallback.AgreementType),
    AgreementDate: pickField("AgreementDate", null, lodFallback.AgreementDate),
    InvoiceNumber: pickField("InvoiceNumber", null, lodFallback.InvoiceNumber),
    DueDate: pickField("DueDate", null, lodFallback.DueDate),
    ReminderDates: pickField("ReminderDates", null, lodFallback.ReminderDates),
    PaymentWindowDays: pickField(
      "PaymentWindowDays",
      null,
      lodFallback.PaymentWindowDays,
    ),
    FinalPaymentDate: pickField("FinalPaymentDate", null, lodFallback.FinalPaymentDate),
    PaymentInstructions: pickField(
      "PaymentInstructions",
      null,
      lodFallback.PaymentInstructions,
    ),
    RemittanceEmail: pickField("RemittanceEmail", null, lodFallback.RemittanceEmail),
    ContactPerson: pickField(
      "ContactPerson",
      "senderName",
      lodFallback.ContactPerson,
    ),
    ContactPhone: pickField("ContactPhone", null, lodFallback.ContactPhone),
    ContactEmail: pickField("ContactEmail", null, lodFallback.ContactEmail),
    DisputeWindowDays: pickField(
      "DisputeWindowDays",
      null,
      lodFallback.DisputeWindowDays,
    ),
    YourSignerName: pickField("YourSignerName", "senderName", lodFallback.YourSignerName),
    YourSignerTitle: pickField("YourSignerTitle", null, lodFallback.YourSignerTitle),
  };

  const defamationFields = {
    ClientName: pickField("ClientName", null, "Anakguam kami"),
    ClientServiceAddress: pickField("ClientServiceAddress", null, "-"),
    BackgroundFacts: pickField("BackgroundFacts", null, ""),
    DefamationActs: pickField("DefamationActs", null, ""),
    DefamatoryStatementsDetails: pickField("DefamatoryStatementsDetails", null, ""),
    ImageUploadDetails: pickField("ImageUploadDetails", null, ""),
    AdditionalPublicationDetails: pickField("AdditionalPublicationDetails", null, ""),
    ReshareDetails: pickField("ReshareDetails", null, ""),
    MainSocialAccount: pickField("MainSocialAccount", null, "-"),
  };

  const merged = {
    ...lodFallback,
    ...fromForm,
    ...defamationFields,
  };

  return {
    ...merged,
    // Support transformed lowercase placeholders in the current LOD template file.
    date: merged.Date,
    senderName: merged.YourCompanyName,
    senderAddress: `${merged.YourCompanyAddressLine1}${
      merged.YourCompanyAddressLine2 ? `, ${merged.YourCompanyAddressLine2}` : ""
    }`,
    recipientName: merged.RecipientName,
    recipientAddress: `${merged.RecipientAddressLine1}${
      merged.RecipientAddressLine2 ? `, ${merged.RecipientAddressLine2}` : ""
    }`,
    subject: merged.Reference,
    body: buildDefamationBodyFromForm(formData, merged.GoodsOrServices),
  };
};

const buildFilledLodDataWorkbook = async (formData = {}) => {
  const variables = buildLodVariables(formData);
  const templatePath = await resolveLodPath(["LOD_Data.xlsx"]);

  const workbookBuffer = await fs.readFile(templatePath);
  const zip = await JSZip.loadAsync(workbookBuffer);
  const sheetXmlPath = Object.keys(zip.files).find((entryPath) =>
    /(^|[\\/])xl[\\/]worksheets[\\/]sheet1\.xml$/i.test(entryPath),
  );

  if (!sheetXmlPath) {
    throw new Error("Invalid XLSX template structure");
  }

  const sheetFile = zip.file(sheetXmlPath);
  if (!sheetFile) {
    throw new Error("Unable to read worksheet XML");
  }

  let sheetXml = await sheetFile.async("string");

  lodColumnOrder.forEach((key, index) => {
    const cellRef = `${columnIndexToLetters(index + 1)}2`;
    const value = escapeXml(`${variables[key] ?? ""}`);
    const cellPattern = new RegExp(`<c r="${cellRef}"[^>]*>.*?<\\/c>`, "s");
    const replacement = `<c r="${cellRef}" t="inlineStr"><is><t>${value}</t></is></c>`;

    sheetXml = sheetXml.replace(cellPattern, replacement);
  });

  zip.file(sheetXmlPath, sheetXml);
  const outputBuffer = await zip.generateAsync({ type: "nodebuffer" });

  const outputPath = path.resolve(lodTemplateDir, "LOD_Data_filled.xlsx");
  await fs.writeFile(outputPath, outputBuffer);
};

const generateLodDocxBuffer = async (formData = {}, language = "english") => {
  const variables = buildLodVariables(formData);
  const templatePath = await resolveLodPath([
    "LOD_Template.docx",
    "LOD_template.docx",
    "LOD_template_generated.docx",
  ]);

  const templateBuffer = await fs.readFile(templatePath);
  const zip = await JSZip.loadAsync(templateBuffer);
  const documentXmlPath = Object.keys(zip.files).find((entryPath) =>
    /(^|[\\/])word[\\/]document\.xml$/i.test(entryPath),
  );
  const documentFile = documentXmlPath ? zip.file(documentXmlPath) : null;

  if (!documentFile) {
    throw new Error("Invalid DOCX template structure");
  }

  let xml = await documentFile.async("string");
  xml = localizeLodDocxXml(xml, language);

  for (const [key, rawValue] of Object.entries(variables)) {
    const token = new RegExp(`\\{\\{${escapeRegExp(key)}\\}\\}`, "g");
    xml = xml.replace(token, escapeXml(`${rawValue ?? ""}`));
  }

  zip.file(documentXmlPath, xml);
  return zip.generateAsync({ type: "nodebuffer" });
};

export const registerLodTemplateRoutes = (app) => {
  app.post("/generate-lod-data-xlsx", async (req, res) => {
    try {
      const formData = req.body?.formData ?? {};
      await buildFilledLodDataWorkbook(formData);
      res.json({ ok: true, file: "LOD_Data_filled.xlsx" });
    } catch (err) {
      console.error("LOD data workbook generation error:", err);
      res.status(500).json({ error: "Failed to generate LOD data workbook" });
    }
  });

  app.post("/generate-lod-docx", async (req, res) => {
    try {
      const formData = req.body?.formData ?? {};
      const language = req.body?.language ?? "english";
      const outputBuffer = await generateLodDocxBuffer(formData, language);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      res.setHeader("Content-Disposition", 'attachment; filename="LOD_Template.docx"');
      res.send(outputBuffer);
    } catch (err) {
      console.error("LOD generation error:", err);
      res.status(500).json({ error: "Failed to generate LOD DOCX" });
    }
  });
};
