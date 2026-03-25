export const templates = [
  {
    id: "official-email",
    title: "Official Email",
    description: "Professional email for business correspondence.",
    fields: [
      { name: "recipientName", label: "Recipient Name", type: "text" },
      { name: "companyName", label: "Company Name", type: "text" },
      { name: "subject", label: "Subject", type: "text" },
      { name: "message", label: "Message Body", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
      { name: "senderTitle", label: "Your Job Title", type: "text" },
    ],
    generate: (data) => `Write a professional email with the following details:

Recipient: ${data.recipientName}
Company: ${data.companyName}
Subject: ${data.subject}
Message: ${data.message}
Sender: ${data.senderName}, ${data.senderTitle}`,
  },

  {
    id: "emergency-leave",
    title: "Emergency Leave Request",
    description: "Formal emergency leave email.",
    fields: [
      { name: "managerName", label: "Manager Name", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "reason", label: "Reason", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a formal emergency leave email:

Manager: ${data.managerName}
From: ${data.senderName}
Leave period: ${data.startDate} to ${data.endDate}
Reason: ${data.reason}`,
  },

  {
    id: "annual-leave",
    title: "Annual Leave Request",
    description: "Formal request for planned annual leave.",
    fields: [
      { name: "managerName", label: "Manager Name", type: "text" },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "reason", label: "Reason (Optional)", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a formal annual leave request email:

Manager: ${data.managerName}
From: ${data.senderName}
Leave period: ${data.startDate} to ${data.endDate}
Reason: ${data.reason || "N/A"}`,
  },

  {
    id: "medical-leave",
    title: "Medical Leave Submission",
    description: "Email to submit a medical certificate and request leave.",
    fields: [
      { name: "managerName", label: "Manager Name", type: "text" },
      { name: "mcDate", label: "Date of MC", type: "date" },
      {
        name: "diagnosis",
        label: "Diagnosis / Reason (Optional)",
        type: "text",
      },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a medical leave email:

Manager: ${data.managerName}
From: ${data.senderName}
MC Date: ${data.mcDate}
Diagnosis / Reason: ${data.diagnosis || "N/A"}`,
  },

  {
    id: "meeting-minutes",
    title: "Meeting Minutes",
    description: "Record notes and decisions from a meeting.",
    fields: [
      { name: "meetingTitle", label: "Meeting Title", type: "text" },
      { name: "date", label: "Date", type: "date" },
      { name: "attendees", label: "Attendees", type: "textarea" },
      { name: "agenda", label: "Agenda Items", type: "textarea" },
      { name: "decisions", label: "Key Decisions", type: "textarea" },
      { name: "actionItems", label: "Action Items", type: "textarea" },
    ],
    generate: (data) => `Write meeting minutes:

Meeting: ${data.meetingTitle}
Date: ${data.date}
Attendees: ${data.attendees}
Agenda: ${data.agenda}
Decisions: ${data.decisions}
Action Items: ${data.actionItems}`,
  },

  {
    id: "project-update",
    title: "Project Update",
    description: "Send a quick update on project progress.",
    fields: [
      { name: "recipientName", label: "Recipient Name", type: "text" },
      { name: "projectName", label: "Project Name", type: "text" },
      { name: "progress", label: "Progress Summary", type: "textarea" },
      { name: "nextSteps", label: "Next Steps", type: "textarea" },
      { name: "senderName", label: "Your Name", type: "text" },
    ],
    generate: (data) => `Write a project update email:

To: ${data.recipientName}
Project: ${data.projectName}
Progress: ${data.progress}
Next Steps: ${data.nextSteps}
From: ${data.senderName}`,
  },

  {
    id: "formal-letter",
    title: "Letter of Demand (LOD)",
    description: "Populate all LOD DOCX variables for demand letter generation.",
    fields: [
      { name: "Date", label: "Date", type: "date" },
      { name: "YourCompanyName", label: "Your Company Name", type: "text" },
      {
        name: "YourCompanyAddressLine1",
        label: "Your Company Address Line 1",
        type: "text",
      },
      {
        name: "YourCompanyAddressLine2",
        label: "Your Company Address Line 2",
        type: "text",
      },
      { name: "YourCompanyPhone", label: "Your Company Phone", type: "text" },
      { name: "YourCompanyEmail", label: "Your Company Email", type: "text" },
      { name: "RecipientName", label: "Recipient Name", type: "text" },
      {
        name: "RecipientCompanyName",
        label: "Recipient Company Name",
        type: "text",
      },
      {
        name: "RecipientAddressLine1",
        label: "Recipient Address Line 1",
        type: "text",
      },
      {
        name: "RecipientAddressLine2",
        label: "Recipient Address Line 2",
        type: "text",
      },
      {
        name: "RecipientSalutation",
        label: "Recipient Salutation",
        type: "text",
      },
      { name: "ClientName", label: "Client Name (Anakguam)", type: "text" },
      {
        name: "ClientServiceAddress",
        label: "Alamat Penyampaian Anakguam",
        type: "textarea",
      },
      {
        name: "BackgroundFacts",
        label: "Fakta Latar Belakang (baris berasingan)",
        type: "textarea",
      },
      {
        name: "DefamationActs",
        label: "Butiran Penyebaran Fitnah (baris berasingan)",
        type: "textarea",
      },
      {
        name: "DefamatoryStatementsDetails",
        label: "Butiran Kenyataan Fitnah",
        type: "textarea",
      },
      {
        name: "ImageUploadDetails",
        label: "Butiran Gambar/Bahan Dimuat Naik",
        type: "textarea",
      },
      {
        name: "AdditionalPublicationDetails",
        label: "Butiran Kenyataan/Penerbitan Tambahan",
        type: "textarea",
      },
      {
        name: "ReshareDetails",
        label: "Butiran Kongsian Semula",
        type: "textarea",
      },
      {
        name: "MainSocialAccount",
        label: "Akaun Media Sosial Utama",
        type: "text",
      },
      { name: "Reference", label: "Reference", type: "text" },
      { name: "Currency", label: "Currency", type: "text" },
      { name: "AmountDue", label: "Amount Due", type: "text" },
      { name: "GoodsOrServices", label: "Goods or Services", type: "textarea" },
      { name: "AgreementType", label: "Agreement Type", type: "text" },
      { name: "AgreementDate", label: "Agreement Date", type: "date" },
      { name: "InvoiceNumber", label: "Invoice Number", type: "text" },
      { name: "DueDate", label: "Due Date", type: "date" },
      { name: "ReminderDates", label: "Reminder Dates", type: "textarea" },
      {
        name: "PaymentWindowDays",
        label: "Payment Window (Days)",
        type: "number",
      },
      {
        name: "FinalPaymentDate",
        label: "Final Payment Date",
        type: "date",
      },
      {
        name: "PaymentInstructions",
        label: "Payment Instructions",
        type: "textarea",
      },
      { name: "RemittanceEmail", label: "Remittance Email", type: "text" },
      { name: "ContactPerson", label: "Contact Person", type: "text" },
      { name: "ContactPhone", label: "Contact Phone", type: "text" },
      { name: "ContactEmail", label: "Contact Email", type: "text" },
      {
        name: "DisputeWindowDays",
        label: "Dispute Window (Days)",
        type: "number",
      },
      { name: "YourSignerName", label: "Signer Name", type: "text" },
      { name: "YourSignerTitle", label: "Signer Title", type: "text" },
    ],
    generate: (data) => `Prepare a Letter of Demand using these variables:

Date: ${data.Date}
YourCompanyName: ${data.YourCompanyName}
RecipientName: ${data.RecipientName}
Reference: ${data.Reference}
Currency: ${data.Currency}
AmountDue: ${data.AmountDue}
GoodsOrServices: ${data.GoodsOrServices}
DisputeWindowDays: ${data.DisputeWindowDays}
YourSignerName: ${data.YourSignerName}
YourSignerTitle: ${data.YourSignerTitle}`,
  },

  {
    id: "writ-of-summons",
    title: "Writ of Summons",
    description: "Generate a Writ of Summons DOCX using WOS variables.",
    fields: [
      { name: "Date", label: "Date", type: "date" },
      { name: "CourtName", label: "Court Name", type: "text" },
      { name: "CourtLocation", label: "Court Location", type: "text" },
      { name: "CaseNumber", label: "Case Number", type: "text" },
      { name: "PlaintiffName", label: "Plaintiff Name", type: "text" },
      { name: "PlaintiffNRIC", label: "Plaintiff NRIC/Reg No", type: "text" },
      {
        name: "PlaintiffAddressLine1",
        label: "Plaintiff Address Line 1",
        type: "text",
      },
      {
        name: "PlaintiffAddressLine2",
        label: "Plaintiff Address Line 2",
        type: "text",
      },
      { name: "DefendantName", label: "Defendant Name", type: "text" },
      { name: "DefendantNRIC", label: "Defendant NRIC/Reg No", type: "text" },
      {
        name: "DefendantAddressLine1",
        label: "Defendant Address Line 1",
        type: "text",
      },
      {
        name: "DefendantAddressLine2",
        label: "Defendant Address Line 2",
        type: "text",
      },
      { name: "Currency", label: "Currency", type: "text" },
      { name: "ClaimAmount", label: "Claim Amount", type: "text" },
      { name: "ClaimDescription", label: "Claim Description", type: "textarea" },
      { name: "ContractDate", label: "Contract Date", type: "date" },
      { name: "BreachDetails", label: "Breach Details", type: "textarea" },
      { name: "InterestRate", label: "Interest Rate", type: "text" },
      { name: "CostsAmount", label: "Costs Amount", type: "text" },
      { name: "AppearanceDays", label: "Appearance Days", type: "number" },
      { name: "HearingDate", label: "Hearing Date", type: "date" },
      { name: "LawFirmName", label: "Law Firm Name", type: "text" },
      { name: "LawFirmAddress", label: "Law Firm Address", type: "textarea" },
      { name: "LawyerName", label: "Lawyer Name", type: "text" },
      { name: "LawyerPhone", label: "Lawyer Phone", type: "text" },
      { name: "LawyerEmail", label: "Lawyer Email", type: "text" },
      {
        name: "CourtSealReference",
        label: "Court Seal Reference",
        type: "text",
      },
    ],
    generate: (data) => `Prepare a Writ of Summons using these variables:

CourtName: ${data.CourtName}
CaseNumber: ${data.CaseNumber}
PlaintiffName: ${data.PlaintiffName}
DefendantName: ${data.DefendantName}
Currency: ${data.Currency}
ClaimAmount: ${data.ClaimAmount}
ClaimDescription: ${data.ClaimDescription}
LawFirmName: ${data.LawFirmName}
LawyerName: ${data.LawyerName}`,
  },

  {
    id: "report",
    title: "Report",
    description: "Simple report format with key sections.",
    fields: [
      { name: "reportTitle", label: "Report Title", type: "text" },
      { name: "date", label: "Date", type: "date" },
      { name: "preparedBy", label: "Prepared By", type: "text" },
      { name: "objective", label: "Objective", type: "textarea" },
      { name: "findings", label: "Findings", type: "textarea" },
      { name: "recommendations", label: "Recommendations", type: "textarea" },
      { name: "conclusion", label: "Conclusion", type: "textarea" },
    ],
    generate: (data) => `Write a simple report:

Title: ${data.reportTitle}
Date: ${data.date}
Prepared By: ${data.preparedBy}
Objective: ${data.objective}
Findings: ${data.findings}
Recommendations: ${data.recommendations}
Conclusion: ${data.conclusion}`,
  },
];
