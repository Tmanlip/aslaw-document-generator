import { cleanLine } from "./utils";

export const buildOfficialEmail = (data) => {
  return [
    `Subject: ${cleanLine(data.subject)}`,
    `To: ${cleanLine(data.recipientName)} (${cleanLine(data.companyName)})`,
    "",
    `Dear ${cleanLine(data.recipientName)},`,
    "",
    cleanLine(data.message),
    "",
    "Thank you.",
    "",
    "Best regards,",
    cleanLine(data.senderName),
    cleanLine(data.senderTitle),
  ].join("\n");
};
