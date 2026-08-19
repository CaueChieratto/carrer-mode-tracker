export const convertStringToDate = (dateStr: string): Date | undefined => {
  if (!dateStr || dateStr.length < 10) return undefined;

  const [day, month, year] = dateStr.split("/");
  const d = new Date(Number(year), Number(month) - 1, Number(day));

  return isNaN(d.getTime()) ? undefined : d;
};
