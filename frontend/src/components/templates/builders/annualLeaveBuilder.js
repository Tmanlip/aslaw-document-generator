import { cleanLine } from "./utils";

export const buildAnnualLeave = (data) => {
  return [
    `Subject: Annual Leave Request (${cleanLine(data.startDate)} to ${cleanLine(data.endDate)})`,
    `To: ${cleanLine(data.managerName)}`,
    "",
    `Dear ${cleanLine(data.managerName)},`,
    "",
    "I would like to apply for annual leave with the following details:",
    `- Employee Name: ${cleanLine(data.senderName)}`,
    `- Leave Period: ${cleanLine(data.startDate)} to ${cleanLine(data.endDate)}`,
    `- Reason: ${cleanLine(data.reason, "N/A")}`,
    "",
    "Please let me know if any further information is needed.",
    "",
    "Sincerely,",
    cleanLine(data.senderName),
  ].join("\n");
};
