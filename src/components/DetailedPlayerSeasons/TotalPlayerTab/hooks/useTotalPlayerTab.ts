import { useMemo } from "react";
import { Career } from "../../../../common/interfaces/Career";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { getContinentByCountry } from "../../../../common/services/GetContinentByCountry";
import { Trophy } from "../../../../common/interfaces/club/trophy";
import { LeagueLevels } from "../../../../common/constants/LeagueLevels";

const getSeasonString = (seasonNumber: number, career: Career): string => {
  const startYear = new Date(career.createdAt).getFullYear() + seasonNumber - 1;
  const continent = getContinentByCountry(career.nation);

  if (continent === "Europa") {
    const endYear = (startYear + 1).toString().slice(-2);
    return `${startYear.toString().slice(-2)}/${endYear}`;
  } else {
    return startYear.toString();
  }
};

export const useTotalPlayerTab = (career: Career, player?: Players) => {
  const allTrophiesWon = useMemo((): Trophy[] => {
    if (!player) return [];

    const seasonsPlayerPlayedStrings = career.clubData
      .filter((season) =>
        season.players.some((p) => p.id === player.id && !p.sell)
      )
      .map((season) => getSeasonString(season.seasonNumber, career));

    const playerTrophies = career.trophies
      .map((trophy) => {
        const seasonsWonByPlayer = trophy.seasons.filter((season) =>
          seasonsPlayerPlayedStrings.includes(season)
        );

        if (seasonsWonByPlayer.length > 0) {
          return {
            ...trophy,
            seasons: seasonsWonByPlayer,
          };
        }

        return null;
      })
      .filter((trophy): trophy is Trophy => trophy !== null);

    return playerTrophies.sort(
      (a, b) =>
        (LeagueLevels[a.leagueName] ?? 999) -
        (LeagueLevels[b.leagueName] ?? 999)
    );
  }, [career, player]);

  return { allTrophiesWon };
};
