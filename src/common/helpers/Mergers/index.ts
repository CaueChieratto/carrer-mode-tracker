import { Career } from "../../interfaces/Career";
import { Trophy } from "../../interfaces/club/trophy";
import { League, leaguesByContinent } from "../../utils/Leagues";

export const mergeTrophies = (
  career: Career,
  leagueName: string,
  seasons: string[]
): Trophy[] => {
  const trophies: Trophy[] = career.trophies || [];

  const allLeagues: League[] = Object.values(leaguesByContinent)
    .flatMap((countryLeagues) => Object.values(countryLeagues))
    .flat() as League[];

  const leagueFound = allLeagues.find((l) => l.name === leagueName);
  if (!leagueFound) {
    console.error("Liga não encontrada:", leagueName);
    return trophies;
  }

  const existingTrophy = trophies.find((t) => t.leagueName === leagueName);

  if (existingTrophy) {
    existingTrophy.seasons = Array.from(
      new Set([...existingTrophy.seasons, ...seasons])
    );
  } else {
    trophies.push({
      leagueName,
      leagueImage: leagueFound.trophy,
      seasons,
    });
  }

  return trophies;
};
