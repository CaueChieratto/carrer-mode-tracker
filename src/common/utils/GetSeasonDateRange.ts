import { leaguesByContinent } from "./Leagues";

export const getSeasonDateRange = (
  seasonNumber: number,
  careerCreatedAt: Date,
  nation: string
): { startDate: Date; endDate: Date } => {
  const europeanNations = Object.keys(leaguesByContinent.Europa);
  const isEuropean = europeanNations.includes(nation);

  const startYear = new Date(careerCreatedAt).getFullYear();
  const seasonOffset = seasonNumber - 1;

  let startDate: Date;
  let endDate: Date;

  if (isEuropean) {
    startDate = new Date(startYear + seasonOffset, 6, 1);
    endDate = new Date(startYear + seasonOffset + 1, 5, 30, 23, 59, 59, 999);
  } else {
    startDate = new Date(startYear + seasonOffset, 0, 1);
    endDate = new Date(startYear + seasonOffset, 11, 31, 23, 59, 59, 999);
  }

  return { startDate, endDate };
};
