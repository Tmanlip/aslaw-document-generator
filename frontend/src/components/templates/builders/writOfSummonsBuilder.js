import { cleanLine } from "./utils";

export const buildWritOfSummons = (data) => {
  return [
    "WRIT OF SUMMONS",
    `Date: ${cleanLine(data.Date)}`,
    `In the ${cleanLine(data.CourtName)} at ${cleanLine(data.CourtLocation)}`,
    `Case No.: ${cleanLine(data.CaseNumber)}`,
    "",
    "Plaintiff:",
    `${cleanLine(data.PlaintiffName)} (NRIC/Reg No: ${cleanLine(data.PlaintiffNRIC)})`,
    cleanLine(data.PlaintiffAddressLine1),
    cleanLine(data.PlaintiffAddressLine2),
    "",
    "Defendant:",
    `${cleanLine(data.DefendantName)} (NRIC/Reg No: ${cleanLine(data.DefendantNRIC)})`,
    cleanLine(data.DefendantAddressLine1),
    cleanLine(data.DefendantAddressLine2),
    "",
    `The Plaintiff claims ${cleanLine(data.Currency)} ${cleanLine(data.ClaimAmount)} for ${cleanLine(data.ClaimDescription)} under contract dated ${cleanLine(data.ContractDate)}.`,
    `Breach Details: ${cleanLine(data.BreachDetails)}`,
    `Interest Rate: ${cleanLine(data.InterestRate)} | Costs: ${cleanLine(data.Currency)} ${cleanLine(data.CostsAmount)}`,
    `Appearance must be entered within ${cleanLine(data.AppearanceDays)} days.`,
    `Hearing Date: ${cleanLine(data.HearingDate)}`,
    "",
    "Issued by:",
    cleanLine(data.LawFirmName),
    cleanLine(data.LawFirmAddress),
    `Solicitor: ${cleanLine(data.LawyerName)}`,
    `Tel: ${cleanLine(data.LawyerPhone)} | Email: ${cleanLine(data.LawyerEmail)}`,
    `Court Seal Ref: ${cleanLine(data.CourtSealReference)}`,
  ].join("\n");
};
