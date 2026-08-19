import { isFirestoreTimestamp } from "../isFirestoreTimestamp";

export const convertDateToString = (date: unknown): string => {
  if (!date) return "";

  let d: Date;

  if (isFirestoreTimestamp(date)) {
    d = date.toDate();
  } else if (date instanceof Date) {
    d = date;
  } else {
    d = new Date(date as string | number);
  }

  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
