export const getValidDate = (dateVal: unknown): Date => {
  if (!dateVal) return new Date();
  if (dateVal instanceof Date) return dateVal;

  if (typeof dateVal === "object" && dateVal !== null) {
    if (
      "toDate" in dateVal &&
      typeof (dateVal as { toDate: unknown }).toDate === "function"
    ) {
      return (dateVal as { toDate: () => Date }).toDate();
    }

    if (
      "seconds" in dateVal &&
      typeof (dateVal as { seconds: unknown }).seconds === "number"
    ) {
      return new Date((dateVal as { seconds: number }).seconds * 1000);
    }
  }

  if (typeof dateVal === "string" || typeof dateVal === "number") {
    const parsedDate = new Date(dateVal);
    if (!isNaN(parsedDate.getTime())) return parsedDate;
  }

  return new Date();
};
