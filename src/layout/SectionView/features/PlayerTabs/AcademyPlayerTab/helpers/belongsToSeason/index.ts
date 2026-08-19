export const belongsToSeason = (
  dateStr: string | undefined,
  seasonNumber: number | undefined,
  careerStartYear: number,
  isEurope: boolean,
): boolean => {
  if (!dateStr || !seasonNumber) return false;

  let parts;
  if (dateStr.includes(" - ")) {
    parts = dateStr.split(" - ")[0].trim().split("/");
  } else {
    parts = dateStr.trim().split("/");
  }

  if (parts.length < 3) return false;

  const month = parseInt(parts[1], 10);
  let year = parseInt(parts[2], 10);

  if (year < 100) year += 2000;

  let eventBaseYear = year;

  if (isEurope && month < 7) {
    eventBaseYear = year - 1;
  }

  const eventSeasonNum = eventBaseYear - careerStartYear + 1;
  return eventSeasonNum === seasonNumber;
};
