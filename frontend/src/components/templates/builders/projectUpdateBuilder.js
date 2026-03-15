import { cleanLine } from "./utils";

export const buildProjectUpdate = (data) => {
  return [
    `Subject: Project Update - ${cleanLine(data.projectName)}`,
    `To: ${cleanLine(data.recipientName)}`,
    "",
    `Dear ${cleanLine(data.recipientName)},`,
    "",
    `Here is the latest update for ${cleanLine(data.projectName)}.`,
    "",
    "Progress Summary:",
    cleanLine(data.progress),
    "",
    "Next Steps:",
    cleanLine(data.nextSteps),
    "",
    "Best regards,",
    cleanLine(data.senderName),
  ].join("\n");
};
