export const getFormattedArrivalDate = (dateStr?: string) => {
  if (!dateStr) return "";

  if (dateStr.includes("T")) {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  }

  if (dateStr.includes(" - ")) {
    return dateStr.split(" - ")[0];
  }

  return dateStr.substring(0, 5);
};
