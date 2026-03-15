import { cleanLine } from "./utils";

export const buildEmergencyLeave = (data) => {
  return [
    `Subject: Emergency Leave Request (${cleanLine(data.startDate)} to ${cleanLine(data.endDate)})`,
    `To: ${cleanLine(data.managerName)}`,
    "",
    `Dear ${cleanLine(data.managerName)},`,
    "",
    "I would like to request emergency leave with the following details:",
    `- Employee Name: ${cleanLine(data.senderName)}`,
    `- Leave Period: ${cleanLine(data.startDate)} to ${cleanLine(data.endDate)}`,
    `- Reason: ${cleanLine(data.reason)}`,
    "",
    "I apologize for any inconvenience caused and appreciate your understanding.",
    "",
    "Sincerely,",
    cleanLine(data.senderName),
  ].join("\n");
};
