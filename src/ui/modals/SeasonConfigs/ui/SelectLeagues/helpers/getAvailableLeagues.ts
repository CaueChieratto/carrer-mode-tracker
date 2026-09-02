import { League } from "../../../../../../common/interfaces/League";
import {
  continentalLeagueByCountry,
  leaguesByContinent,
} from "../../../../../../common/utils/league";

export const getAvailableLeagues = (nation: string): League[] => {
  for (const countries of Object.values(leaguesByContinent)) {
    const nationalLeagues = countries[nation];

    if (!nationalLeagues) continue;

    const continentalKey = continentalLeagueByCountry[nation];

    return [
      ...nationalLeagues,
      ...(continentalKey ? (countries[continentalKey] ?? []) : []),
    ];
  }

  return [];
};
