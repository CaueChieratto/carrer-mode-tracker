import { League, leaguesByContinent } from "../../../common/utils/Leagues";

export const getAvailableLeagues = (nation: string): League[] => {
  for (const [continent, countries] of Object.entries(leaguesByContinent)) {
    if (!countries[nation]) continue;

    const nationLeagues = [...countries[nation]];

    if (continent === "Europa" && countries["UEFA"]) {
      return [...nationLeagues, ...countries["UEFA"]];
    }

    if (continent === "América" && countries["Conmebol"]) {
      return [...nationLeagues, ...countries["Conmebol"]];
    }

    return nationLeagues;
  }

  return [];
};
