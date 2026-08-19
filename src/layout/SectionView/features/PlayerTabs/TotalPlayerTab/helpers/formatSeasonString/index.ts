export const formatSeasonString = (
  createdAt: string | Date,
  seasonNumber: number,
  nation: string,
): string => {
  const startYear = new Date(createdAt).getFullYear() + seasonNumber - 1;
  const endYear = (startYear + 1).toString().slice(-2);

  if (["Brasil", "EUA", "Argentina"].includes(nation)) {
    return startYear.toString();
  }

  return `${startYear.toString().slice(-2)}/${endYear}`;
};
