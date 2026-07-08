export const parseMinute = (minStr: string | number): number => {
  const str = String(minStr);
  if (str.includes("+")) {
    const [base, extra] = str.split("+");
    return Number(base) + Number(extra);
  }
  return Number(str.replace(/[^0-9]/g, ""));
};

export const getInterval = (min: number): string => {
  if (min <= 15) return "0-15'";
  if (min <= 30) return "16-30'";
  if (min <= 45) return "31-45'";
  if (min <= 60) return "46-60'";
  if (min <= 75) return "61-75'";
  return "76-90+'";
};

export const getTopN = (record: Record<string | number, number>, n = 5) =>
  Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, count]) => ({ label: String(label), count }));
