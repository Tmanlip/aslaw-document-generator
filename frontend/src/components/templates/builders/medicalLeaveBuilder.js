import { cleanLine } from "./utils";

export const buildMedicalLeave = (data) => {
  return [
    `Subject: Medical Leave Submission (${cleanLine(data.mcDate)})`,
    `To: ${cleanLine(data.managerName)}`,
    "",
    `Dear ${cleanLine(data.managerName)},`,
    "",
    "I am submitting my medical leave details below:",
    `- Employee Name: ${cleanLine(data.senderName)}`,
    `- MC Date: ${cleanLine(data.mcDate)}`,
    `- Diagnosis/Reason: ${cleanLine(data.diagnosis, "N/A")}`,
    "",
    "Please find my medical leave request for your review.",
    "",
    "Sincerely,",
    cleanLine(data.senderName),
  ].join("\n");
};
