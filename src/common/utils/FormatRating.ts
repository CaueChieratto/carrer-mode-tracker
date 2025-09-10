export const formatRating = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) {
    return "";
  }
  if (digits.length === 1) {
    return digits;
  }
  if (digits.length <= 3) {
    return `${digits.slice(0, 1)}.${digits.slice(1)}`;
  }
  return `${digits.slice(0, 1)}.${digits.slice(1, 3)}`;
};
