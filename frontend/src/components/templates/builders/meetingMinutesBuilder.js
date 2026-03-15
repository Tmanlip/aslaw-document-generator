import {
  formatBulletedList,
  formatNumberedList,
  splitListInput,
} from "./utils";

export const buildMeetingMinutes = (data) => {
  const attendees = splitListInput(data.attendees);
  const agenda = splitListInput(data.agenda);
  const decisions = splitListInput(data.decisions);
  const actionItems = splitListInput(data.actionItems);

  return [
    "Meeting Minutes",
    `Meeting: ${data.meetingTitle || "N/A"}`,
    `Date: ${data.date || "N/A"}`,
    "",
    "Attendees:",
    formatNumberedList(attendees),
    "",
    "Agenda:",
    formatBulletedList(agenda),
    "",
    "Decisions:",
    formatNumberedList(decisions),
    "",
    "Action Items:",
    formatNumberedList(actionItems),
  ].join("\n");
};
