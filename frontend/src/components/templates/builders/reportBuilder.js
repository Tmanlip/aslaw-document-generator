import { cleanLine } from "./utils";

export const buildReport = (data) => {
  return [
    `Report Title: ${cleanLine(data.reportTitle)}`,
    `Date: ${cleanLine(data.date)}`,
    `Prepared By: ${cleanLine(data.preparedBy)}`,
    "",
    "Objective:",
    cleanLine(data.objective),
    "",
    "Findings:",
    cleanLine(data.findings),
    "",
    "Recommendations:",
    cleanLine(data.recommendations),
    "",
    "Conclusion:",
    cleanLine(data.conclusion),
  ].join("\n");
};
