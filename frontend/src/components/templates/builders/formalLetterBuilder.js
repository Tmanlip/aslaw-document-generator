import { chooseByLanguage, cleanLine, splitListInput } from "./utils";

const buildNumberedItems = (rawValue, startNumber = 1) => {
  const items = splitListInput(rawValue);
  if (items.length === 0) {
    return `${startNumber}. ${cleanLine("", "-")}`;
  }

  return items
    .map((item, index) => `${startNumber + index}. ${item}`)
    .join("\n");
};

const isDefamationContent = (data) => {
  return !!(
    cleanLine(data.DefamationActs, "").trim() ||
    cleanLine(data.ClientName, "").trim() ||
    cleanLine(data.BackgroundFacts, "").trim()
  );
};

export const buildFormalLetter = (data, language = "english") => {
  const letterTitle = chooseByLanguage(language, "LETTER OF DEMAND", "SURAT TUNTUTAN");
  const subjectPrefix = chooseByLanguage(language, "RE", "PER");
  const greeting = chooseByLanguage(language, "Dear Sir/Madam", "Tuan/Puan,");
  const referencePrefix = chooseByLanguage(language, "Ref", "Ruj");
  const telLabel = chooseByLanguage(language, "Tel", "Tel");
  const emailLabel = chooseByLanguage(language, "Email", "E-mel");
  const invoiceLabel = chooseByLanguage(language, "Invoice", "Invois");
  const dueDateLabel = chooseByLanguage(language, "Due date", "Tarikh akhir");
  const isMalay = language === "malay";
  const hasDefamation = isDefamationContent(data);

  if (hasDefamation && isMalay) {
    const openingParagraph = `Merujuk kepada perkara di atas di mana kami bertindak bagi pihak ${cleanLine(data.ClientName, "Anakguam kami")} (\"Anakguam kami\") yang mempunyai alamat penyampaian di ${cleanLine(data.ClientServiceAddress, "-")}.`;
    const instructionParagraph = "Adalah dimaklumkan bahawa pihak kami telah diarahkan oleh Anakguam kami untuk menyatakan seperti berikut:";
    const backgroundPoints = buildNumberedItems(data.BackgroundFacts, 1);

    const defamationHeading = `Penyebaran fitnah oleh Tuan/Puan ke atas Anakguam kami adalah seperti berikut:`;
    const defamationActs = buildNumberedItems(data.DefamationActs, 5);

    const statementHeading = "Kenyataan-kenyataan fitnah pihak Tuan/Puan adalah seperti berikut:";
    const statementDetails = cleanLine(data.DefamatoryStatementsDetails, "-");
    const imageHeading = "Di dalam gambar atau bahan media yang dimuat naik bersama kenyataan tersebut:";
    const imageDetails = cleanLine(data.ImageUploadDetails, "-");
    const additionalPublicationDetails = cleanLine(data.AdditionalPublicationDetails, "-");
    const reshareDetails = cleanLine(data.ReshareDetails, "-");

    const demandNotice = "SILA AMBIL PERHATIAN, oleh kerana pihak Tuan/Puan telah membuat Pernyataan-Pernyataan Fitnah tersebut kepada Anakguam kami, MAKA kami dengan ini diarahkan oleh Anakguam kami supaya membuat TUNTUTAN TERHADAP PIHAK TUAN/PUAN dan DENGAN INI KAMI MENUNTUT pihak Tuan/Puan seperti berikut:";

    const demandDays = cleanLine(data.PaymentWindowDays, "5");
    const damagesAmount = `${cleanLine(data.Currency, "RM")} ${cleanLine(data.AmountDue, "500,000.00")}`;
    const socialAccount = cleanLine(data.MainSocialAccount, "-");

    const demands = [
      `i. Dalam masa ${demandDays} hari dari tarikh surat ini pihak Tuan/Puan memadam kesemua kenyataan yang mengandungi Pernyataan-Pernyataan Fitnah tersebut yang ditujukan kepada Anakguam kami.`,
      `ii. Dalam masa ${demandDays} hari dari tarikh surat ini pihak Tuan/Puan mengeluarkan dan menerbitkan satu akujanji kepada Anakguam kami bahawa pihak Tuan/Puan tidak akan membuat Pernyataan-Pernyataan Fitnah tersebut lagi ke atas Anakguam kami secara awam dan/atau melalui mana-mana laman sosial.`,
      `iii. Dalam masa ${demandDays} hari dari tarikh surat ini pihak Tuan/Puan mengeluarkan dan menerbitkan draf permohonan maaf secara video dan bertulis kepada pihak kami.`,
      `iv. Selepas pihak kami meluluskan draf permohonan maaf secara video dan bertulis tersebut, permohonan maaf tersebut hendaklah dimuat naik di semua akaun media sosial milik Tuan/Puan termasuk akaun ${socialAccount} dan ditetapkan secara umum (public) selama-lamanya.`,
      `v. Dalam masa ${demandDays} hari dari tarikh surat ini pihak Tuan/Puan membayar kepada Anakguam kami atau kami sebagai peguam cara bagi Anakguam kami gantirugi sebanyak ${damagesAmount} atas Pernyataan-Pernyataan Fitnah tersebut oleh pihak Tuan/Puan ke atas Anakguam kami.`,
    ].join("\n");

    const reservationParagraph = "SILA AMBIL PERHATIAN SETERUSNYA bahawa tuntutan-tuntutan di atas dibuat tanpa prasangka ke atas hak-hak dan remedi yang tersedia kepada Anakguam kami. Jika pihak Tuan/Puan gagal dan enggan untuk berbuat sedemikian, maka kami mempunyai arahan tegas Anakguam kami untuk memfailkan tindakan sivil di Mahkamah tanpa notis lanjut.";
    const replyReferenceLine = "Sila nyatakan rujukan kami apabila membalas.";

    return [
      cleanLine(data.YourCompanyName),
      cleanLine(data.YourCompanyAddressLine1),
      cleanLine(data.YourCompanyAddressLine2),
      `${telLabel}: ${cleanLine(data.YourCompanyPhone)} | ${emailLabel}: ${cleanLine(data.YourCompanyEmail)}`,
      "",
      cleanLine(data.Date),
      "",
      cleanLine(data.RecipientName),
      cleanLine(data.RecipientCompanyName),
      cleanLine(data.RecipientAddressLine1),
      cleanLine(data.RecipientAddressLine2),
      "",
      `${referencePrefix}: ${cleanLine(data.Reference)}`,
      `${subjectPrefix}: ${letterTitle}`,
      "",
      "TANPA PREJUDIS",
      "",
      greeting,
      "",
      openingParagraph,
      "",
      instructionParagraph,
      backgroundPoints,
      "",
      defamationHeading,
      defamationActs,
      "",
      statementHeading,
      statementDetails,
      "",
      imageHeading,
      imageDetails,
      "",
      additionalPublicationDetails,
      "",
      reshareDetails,
      "",
      demandNotice,
      "",
      demands,
      "",
      reservationParagraph,
      "",
      replyReferenceLine,
      "",
      closing,
      cleanLine(data.YourSignerName),
      cleanLine(data.YourSignerTitle),
    ].join("\n");
  }

  if (hasDefamation && !isMalay) {
    const openingParagraph = `With reference to the above matter, we act on behalf of ${cleanLine(data.ClientName, "our client")} (\"our client\") whose service address is ${cleanLine(data.ClientServiceAddress, "-")}.`;
    const instructionParagraph = "We are instructed by our client to state as follows:";
    const backgroundPoints = buildNumberedItems(data.BackgroundFacts, 1);

    const defamationHeading = "The defamatory statements made by you against our client are as follows:";
    const defamationActs = buildNumberedItems(data.DefamationActs, 5);

    const statementHeading = "Details of the defamatory statements made by you are as follows:";
    const statementDetails = cleanLine(data.DefamatoryStatementsDetails, "-");
    const imageHeading = "In the images or media uploaded with the statements:";
    const imageDetails = cleanLine(data.ImageUploadDetails, "-");
    const additionalPublicationDetails = cleanLine(data.AdditionalPublicationDetails, "-");
    const reshareDetails = cleanLine(data.ReshareDetails, "-");

    const demandNotice = "PLEASE NOTE that as a result of your defamatory statements against our client, we are instructed by our client to make a DEMAND AGAINST YOU and HEREBY DEMAND that you:";

    const demandDays = cleanLine(data.PaymentWindowDays, "5");
    const damagesAmount = `${cleanLine(data.Currency, "RM")} ${cleanLine(data.AmountDue, "500,000.00")}`;
    const socialAccount = cleanLine(data.MainSocialAccount, "-");

    const demands = [
      `i. Within ${demandDays} days from the date of this letter, remove all statements containing the defamatory statements directed at our client.`,
      `ii. Within ${demandDays} days from the date of this letter, make and publish an undertaking to our client that you will not make further defamatory statements against our client publicly and/or on any social media platform.`,
      `iii. Within ${demandDays} days from the date of this letter, prepare and submit a draft apology in both video and written form to us.`,
      `iv. After our approval of the draft apology in video and written form, the apology must be posted on all of your social media accounts including ${socialAccount} and set to public for an indefinite period.`,
      `v. Within ${demandDays} days from the date of this letter, pay to our client or us as solicitors for our client, damages in the amount of ${damagesAmount} for the defamatory statements made by you against our client.`,
    ].join("\n");

    const reservationParagraph = "PLEASE FURTHER NOTE that the above demands are made without prejudice to all the rights and remedies available to our client. Should you fail or refuse to comply with these demands, we are instructed by our client to commence civil proceedings in court without further notice.";
    const replyReferenceLine = "Please quote our reference when replying.";

    return [
      cleanLine(data.YourCompanyName),
      cleanLine(data.YourCompanyAddressLine1),
      cleanLine(data.YourCompanyAddressLine2),
      `${telLabel}: ${cleanLine(data.YourCompanyPhone)} | ${emailLabel}: ${cleanLine(data.YourCompanyEmail)}`,
      "",
      cleanLine(data.Date),
      "",
      cleanLine(data.RecipientName),
      cleanLine(data.RecipientCompanyName),
      cleanLine(data.RecipientAddressLine1),
      cleanLine(data.RecipientAddressLine2),
      "",
      `${referencePrefix}: ${cleanLine(data.Reference)}`,
      `${subjectPrefix}: ${letterTitle}`,
      "",
      "WITHOUT PREJUDICE",
      "",
      greeting,
      "",
      openingParagraph,
      "",
      instructionParagraph,
      backgroundPoints,
      "",
      defamationHeading,
      defamationActs,
      "",
      statementHeading,
      statementDetails,
      "",
      imageHeading,
      imageDetails,
      "",
      additionalPublicationDetails,
      "",
      reshareDetails,
      "",
      demandNotice,
      "",
      demands,
      "",
      reservationParagraph,
      "",
      replyReferenceLine,
      "",
      "Sincerely,",
      cleanLine(data.YourSignerName),
      cleanLine(data.YourSignerTitle),
    ].join("\n");
  }

  const closing = chooseByLanguage(language, "Sincerely,", "Yang benar,");
  const firstParagraph = chooseByLanguage(
    language,
    `We refer to the outstanding sum of ${cleanLine(data.Currency)} ${cleanLine(data.AmountDue)} owing to ${cleanLine(data.YourCompanyName)} for ${cleanLine(data.GoodsOrServices)} under ${cleanLine(data.AgreementType)} dated ${cleanLine(data.AgreementDate)} (${invoiceLabel}: ${cleanLine(data.InvoiceNumber)}; ${dueDateLabel}: ${cleanLine(data.DueDate)}).`,
    `Kami merujuk kepada jumlah tertunggak sebanyak ${cleanLine(data.Currency)} ${cleanLine(data.AmountDue)} yang perlu dibayar kepada ${cleanLine(data.YourCompanyName)} bagi ${cleanLine(data.GoodsOrServices)} di bawah ${cleanLine(data.AgreementType)} bertarikh ${cleanLine(data.AgreementDate)} (${invoiceLabel}: ${cleanLine(data.InvoiceNumber)}; ${dueDateLabel}: ${cleanLine(data.DueDate)}).`
  );
  const secondParagraph = chooseByLanguage(
    language,
    `Despite our previous reminders dated ${cleanLine(data.ReminderDates)}, the above amount remains unpaid. You are hereby formally required to settle the full outstanding sum within ${cleanLine(data.PaymentWindowDays)} days from the date of this letter, that is, on or before ${cleanLine(data.FinalPaymentDate)}.`,
    `Walaupun peringatan terdahulu kami bertarikh ${cleanLine(data.ReminderDates)} telah diberikan, jumlah tersebut masih belum dijelaskan. Dengan ini, pihak tuan/puan dikehendaki secara rasmi untuk menjelaskan baki penuh dalam tempoh ${cleanLine(data.PaymentWindowDays)} hari dari tarikh surat ini, iaitu selewat-lewatnya pada ${cleanLine(data.FinalPaymentDate)}.`
  );
  const thirdParagraph = chooseByLanguage(
    language,
    `Payment shall be made to ${cleanLine(data.PaymentInstructions)} and remittance advice shall be emailed to ${cleanLine(data.RemittanceEmail)}. Should you dispute any part of this demand, written particulars of such dispute must be provided to ${cleanLine(data.ContactPerson)} at ${cleanLine(data.ContactPhone)} / ${cleanLine(data.ContactEmail)} within ${cleanLine(data.DisputeWindowDays)} days. Failing payment or substantive response within the stipulated period, we reserve all rights to commence legal proceedings without further notice.`,
    `Pembayaran hendaklah dibuat kepada ${cleanLine(data.PaymentInstructions)} dan bukti pembayaran hendaklah diemelkan kepada ${cleanLine(data.RemittanceEmail)}. Sekiranya pihak tuan/puan mempertikaikan mana-mana bahagian tuntutan ini, butiran pertikaian secara bertulis hendaklah dikemukakan kepada ${cleanLine(data.ContactPerson)} di ${cleanLine(data.ContactPhone)} / ${cleanLine(data.ContactEmail)} dalam tempoh ${cleanLine(data.DisputeWindowDays)} hari. Sekiranya tiada pembayaran atau maklum balas substantif diterima dalam tempoh yang ditetapkan, kami berhak memulakan tindakan undang-undang tanpa notis lanjut.`
  );

  return [
    cleanLine(data.YourCompanyName),
    cleanLine(data.YourCompanyAddressLine1),
    cleanLine(data.YourCompanyAddressLine2),
    `${telLabel}: ${cleanLine(data.YourCompanyPhone)} | ${emailLabel}: ${cleanLine(data.YourCompanyEmail)}`,
    "",
    cleanLine(data.Date),
    "",
    cleanLine(data.RecipientName),
    cleanLine(data.RecipientCompanyName),
    cleanLine(data.RecipientAddressLine1),
    cleanLine(data.RecipientAddressLine2),
    "",
    `${referencePrefix}: ${cleanLine(data.Reference)}`,
    `${subjectPrefix}: ${letterTitle}`,
    "",
    "WITHOUT PREJUDICE",
    "",
    language === "english" ? greeting : greeting,
    "",
    firstParagraph,
    "",
    secondParagraph,
    "",
    thirdParagraph,
    "",
    closing,
    cleanLine(data.YourSignerName),
    cleanLine(data.YourSignerTitle),
  ].join("\n");
};
