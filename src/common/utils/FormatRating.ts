export const formatRating = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  if (digits.startsWith("10")) {
    if (digits.length === 2) {
      // "10"
      return "10";
    }
    return "10.0";
  }

  if (digits.length === 1) {
    return digits;
  }
  if (digits.length === 2) {
    return `${digits[0]}.${digits[1]}`;
  }
  return `${digits[0]}.${digits.slice(1, 3)}`;
};
