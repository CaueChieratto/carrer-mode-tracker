import { leaguesByContinent } from "./Leagues";

export const getSeasonName = (
  seasonNumber: number,
  careerCreatedAt: Date | string,
  nation: string,
): string => {
  const europeanNations = Object.keys(leaguesByContinent.Europa);
  const isEuropean = europeanNations.includes(nation);

  const startYear = new Date(careerCreatedAt).getFullYear();
  const seasonOffset = seasonNumber - 1;

  if (isEuropean) {
    const year1 = startYear + seasonOffset;
    const year2 = year1 + 1;
    return `${year1.toString().slice(-2)}/${year2.toString().slice(-2)}`;
  } else {
    const year = startYear + seasonOffset;
    return `${year}`;
  }
};
