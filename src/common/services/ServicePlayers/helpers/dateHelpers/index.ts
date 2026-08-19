export const parseFirestoreDate = (val: unknown): Date | null => {
  if (!val) return null;
  if (
    typeof val === "object" &&
    "toDate" in val &&
    typeof (val as { toDate: unknown }).toDate === "function"
  ) {
    return (val as { toDate: () => Date }).toDate();
  }
  return new Date(val as string | Date);
};
