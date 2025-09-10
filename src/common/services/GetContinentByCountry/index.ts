import { leaguesByContinent } from "../../utils/Leagues";

export const getContinentByCountry = (country: string): string | null => {
  for (const continent in leaguesByContinent) {
    if (leaguesByContinent[continent][country]) return continent;
  }
  return null;
};
