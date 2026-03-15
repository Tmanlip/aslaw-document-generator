export const splitListInput = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(/\r?\n|[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const cleanLine = (value, fallback = "N/A") => {
  const text = (value || "").trim();
  return text || fallback;
};

export const formatNumberedList = (items) => {
  if (items.length === 0) {
    return "1. N/A";
  }

  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
};

export const formatBulletedList = (items) => {
  if (items.length === 0) {
    return "- N/A";
  }

  return items.map((item) => `- ${item}`).join("\n");
};
