export const formatSeason = (value: string, continent?: string | null) => {
  let digits = value.replace(/\D/g, "");

  if (continent === "Europa") {
    if (digits.length > 4) digits = digits.slice(0, 4);
    if (digits.length > 2) digits = digits.slice(0, 2) + "/" + digits.slice(2);
  } else {
    if (digits.length > 4) digits = digits.slice(0, 4);
  }

  return digits;
};
