import { useState } from "react";
import { Career } from "../../../common/interfaces/Career";
import { Players } from "../../../common/interfaces/playersInfo/players";
import { getContinentByCountry } from "../../../common/services/GetContinentByCountry";
import { League, leaguesByContinent } from "../../../common/utils/Leagues";
import { LeagueLevels } from "../../../common/constants/LeagueLevels";

export const useSeasonsPlayerTab = (career: Career, player?: Players) => {
  const [expand, setExpand] = useState<Record<string, boolean>>({});

  const toggleExpand = (seasonId: string) => {
    setExpand((prev) => ({
      ...prev,
      [seasonId]: !prev[seasonId],
    }));
  };

  const playerId = player?.id;

  const seasonsPlayerPlayed = career.clubData.filter((s) =>
    s.players.some((p) => p.id === playerId)
  );

  const getSeasonString = (seasonNumber: number): string => {
    const startYear =
      new Date(career.createdAt).getFullYear() + seasonNumber - 1;
    const continent = getContinentByCountry(career.nation);

    if (continent === "Europa") {
      const endYear = (startYear + 1).toString().slice(-2);
      return `${startYear.toString().slice(-2)}/${endYear}`;
    } else {
      return startYear.toString();
    }
  };

  const allLeagues: League[] = Object.values(leaguesByContinent)
    .flatMap((countryLeagues) => Object.values(countryLeagues))
    .flat();

  const getTrophiesWonInSeason = (seasonString: string) => {
    return career.trophies
      .filter((trophy) => trophy.seasons.includes(seasonString))
      .sort(
        (a, b) =>
          (LeagueLevels[a.leagueName] ?? 999) -
          (LeagueLevels[b.leagueName] ?? 999)
      );
  };

  return {
    expand,
    toggleExpand,
    seasonsPlayerPlayed,
    getSeasonString,
    allLeagues,
    getTrophiesWonInSeason,
    playerId,
  };
};
