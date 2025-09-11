import { leaguesByContinent } from "./Leagues";

export const getSeasonDateRange = (
  seasonNumber: number,
  nation: string
): { startDate: Date; endDate: Date } => {
  const europeanNations = Object.keys(leaguesByContinent.Europa);
  const isEuropean = europeanNations.includes(nation);

  // Usar o ano base da SEASON, não da data de criação
  const baseYear = 2024; // ou algum ano fixo que você definiu para season 1
  const seasonOffset = seasonNumber - 1;

  let startDate: Date;
  let endDate: Date;

  if (isEuropean) {
    startDate = new Date(baseYear + seasonOffset, 6, 1); // 1/jul
    endDate = new Date(baseYear + seasonOffset + 1, 5, 31); // 30/jun do ano seguinte
  } else {
    startDate = new Date(baseYear + seasonOffset, 0, 1); // 1/jan
    endDate = new Date(baseYear + seasonOffset, 11, 31); // 31/dez
  }

  return { startDate, endDate };
};
