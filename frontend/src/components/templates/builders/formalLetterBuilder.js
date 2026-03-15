import { cleanLine } from "./utils";

export const buildFormalLetter = (data) => {
  return [
    cleanLine(data.YourCompanyName),
    cleanLine(data.YourCompanyAddressLine1),
    cleanLine(data.YourCompanyAddressLine2),
    `Tel: ${cleanLine(data.YourCompanyPhone)} | Email: ${cleanLine(data.YourCompanyEmail)}`,
    "",
    cleanLine(data.Date),
    "",
    cleanLine(data.RecipientName),
    cleanLine(data.RecipientCompanyName),
    cleanLine(data.RecipientAddressLine1),
    cleanLine(data.RecipientAddressLine2),
    "",
    `LETTER OF DEMAND: ${cleanLine(data.Reference)}`,
    "",
    `Dear ${cleanLine(data.RecipientSalutation)},`,
    "",
    `We refer to the outstanding sum of ${cleanLine(data.Currency)} ${cleanLine(data.AmountDue)} owing to ${cleanLine(data.YourCompanyName)} for ${cleanLine(data.GoodsOrServices)} under ${cleanLine(data.AgreementType)} dated ${cleanLine(data.AgreementDate)} (Invoice: ${cleanLine(data.InvoiceNumber)}; Due date: ${cleanLine(data.DueDate)}).`,
    "",
    `Despite our previous reminders dated ${cleanLine(data.ReminderDates)}, the above amount remains unpaid. This letter serves as a formal demand for payment of the full outstanding balance within ${cleanLine(data.PaymentWindowDays)} days from the date of this letter (i.e., on or before ${cleanLine(data.FinalPaymentDate)}).`,
    "",
    `Please arrange payment to ${cleanLine(data.PaymentInstructions)} and email the remittance advice to ${cleanLine(data.RemittanceEmail)}. If you dispute any part of this demand, contact ${cleanLine(data.ContactPerson)} at ${cleanLine(data.ContactPhone)} / ${cleanLine(data.ContactEmail)} within ${cleanLine(data.DisputeWindowDays)} days.`,
    "",
    "Sincerely,",
    cleanLine(data.YourSignerName),
    cleanLine(data.YourSignerTitle),
  ].join("\n");
};
