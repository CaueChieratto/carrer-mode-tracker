import { leaguesByContinent } from "../../../../../../../../../common/utils/Leagues";

export const isLeagueCompetition = (leagueName: string): boolean => {
  for (const continent of Object.values(leaguesByContinent)) {
    for (const country of Object.values(continent)) {
      const league = country.find((l) => l.name === leagueName);

      if (league) {
        return !!league.league;
      }
    }
  }

  return false;
};
