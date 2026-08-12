import { useMemo } from "react";
import { AcademyPlayers } from "../../../interfaces/AcademyPlayers/AcademyPlayers";
import { isEuropeanSeason } from "../../../utils/isEuropeanSeason";
import { Career } from "../../../../../../../common/interfaces/Career";
import { getSeasonMonthWeight } from "../../../components/Player/components/PlayerDevelopment/utils/getSeasonMonthWeight";
import { POSITION_DATA } from "../../../../../../../common/types/Positions";
import { usePersistedSort } from "../usePersistedSort";
import { PLAYER_SORT_OPTIONS } from "../../../constants/Sorts";

export type PlayerSortOption =
  | "default"
  | "shirtNumber-asc"
  | "age-asc"
  | "name-asc"
  | "weight-desc"
  | "height-desc"
  | "position-asc"
  | "overall-desc";

const getPositionRank = (position: string): number => {
  let globalRank = 0;
  for (const sector of POSITION_DATA) {
    const positions = sector.sortOrder ?? sector.positions ?? [];
    const index = positions.indexOf(position);
    if (index !== -1) {
      return globalRank + index;
    }
    globalRank += positions.length;
  }
  return 999;
};

export const useSortedPlayers = (players: AcademyPlayers[], career: Career) => {
  const storageKey = `@academy_playerSort_${career.id}`;

  const {
    sortOption: playerSort,
    isReversed,
    handleSortChange: setPlayerSort,
  } = usePersistedSort<PlayerSortOption>(storageKey, "default");

  const sortedPlayers = useMemo(() => {
    const isEurope = isEuropeanSeason(career);

    return [...players].sort((a, b) => {
      let result = 0;

      switch (playerSort) {
        case "shirtNumber-asc":
          result = (a.shirtNumber || 999) - (b.shirtNumber || 999);
          break;
        case "age-asc":
          result = a.age - b.age;
          break;
        case "name-asc":
          result = a.name.localeCompare(b.name);
          break;
        case "weight-desc":
          result = b.weight - a.weight;
          break;
        case "height-desc":
          result = b.height - a.height;
          break;
        case "position-asc":
          result = getPositionRank(a.position) - getPositionRank(b.position);
          break;
        case "overall-desc":
          result = b.overall - a.overall;
          break;
        case "default":
        default: {
          const getYear = (dateStr: string) => {
            const parts = dateStr.split(" - ");
            if (parts.length > 1) {
              return parseInt(parts[1].split("/")[0], 10) || 0;
            }
            return 0;
          };

          const yearA = getYear(a.arrivalDate);
          const yearB = getYear(b.arrivalDate);

          if (yearA !== yearB) {
            result = yearB - yearA;
            break;
          }

          const monthA = a.arrivalDate.split("/")[1]?.split(" ")[0] || "1";
          const monthB = b.arrivalDate.split("/")[1]?.split(" ")[0] || "1";

          const weightA = getSeasonMonthWeight(monthA, isEurope);
          const weightB = getSeasonMonthWeight(monthB, isEurope);

          if (weightA !== weightB) {
            result = weightB - weightA;
            break;
          }

          const dayA = parseInt(a.arrivalDate.split("/")[0] || "1", 10);
          const dayB = parseInt(b.arrivalDate.split("/")[0] || "1", 10);

          result = dayB - dayA;
          break;
        }
      }

      return isReversed ? -result : result;
    });
  }, [players, playerSort, isReversed, career]);

  return {
    sortedPlayers,
    playerSort,
    setPlayerSort,
    isReversed,
    playerSortOptions: PLAYER_SORT_OPTIONS,
  };
};
