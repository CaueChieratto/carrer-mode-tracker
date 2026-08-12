import { useMemo } from "react";
import { AcademyTournaments } from "../../../interfaces/AcademyTournaments/AcademyTournaments";
import { usePersistedSort } from "../usePersistedSort";
import { TOURNAMENT_SORT_OPTIONS } from "../../../constants/Sorts";
import { Career } from "../../../../../../../common/interfaces/Career";
import { isEuropeanSeason } from "../../../utils/isEuropeanSeason";
import { getSeasonMonthWeight } from "../../../components/Player/components/PlayerDevelopment/utils/getSeasonMonthWeight";

export type TournamentSortOption = "default" | "date-asc" | "edition-asc";

export const useSortedTournaments = (
  tournaments: AcademyTournaments[],
  career: Career,
) => {
  const storageKey = `@academy_tournamentSort_${career.id}`;
  const {
    sortOption: tournamentSort,
    isReversed,
    handleSortChange: setTournamentSort,
  } = usePersistedSort<TournamentSortOption>(storageKey, "default");

  const sortedTournaments = useMemo(() => {
    const isEurope = isEuropeanSeason(career);

    return [...tournaments].sort((a, b) => {
      let result = 0;

      switch (tournamentSort) {
        case "edition-asc": {
          const getEdition = (name: string) => {
            if (!name) return 0;
            const parts = name.split("-");
            if (parts.length > 1) {
              const editionStr = parts[1].replace(/\D/g, "");
              return parseInt(editionStr, 10) || 0;
            }
            return 0;
          };

          result = getEdition(a.name) - getEdition(b.name);
          break;
        }

        case "date-asc": {
          const getYear = (dateStr: string) => {
            const parts = dateStr.split(" - ");
            if (parts.length > 1) {
              return parseInt(parts[1].split("/")[0], 10) || 0;
            }
            return parseInt(dateStr.split("/")[2] || "0", 10) || 0;
          };

          const yearA = getYear(a.date || "01/01/2000");
          const yearB = getYear(b.date || "01/01/2000");

          if (yearA !== yearB) {
            result = yearA - yearB;
            break;
          }

          const monthA =
            (a.date || "01/01/2000").split("/")[1]?.split(" ")[0] || "1";
          const monthB =
            (b.date || "01/01/2000").split("/")[1]?.split(" ")[0] || "1";

          const weightA = getSeasonMonthWeight(monthA, isEurope);
          const weightB = getSeasonMonthWeight(monthB, isEurope);

          if (weightA !== weightB) {
            result = weightA - weightB;
            break;
          }

          const dayA = parseInt(
            (a.date || "01/01/2000").split("/")[0] || "1",
            10,
          );
          const dayB = parseInt(
            (b.date || "01/01/2000").split("/")[0] || "1",
            10,
          );

          result = dayA - dayB;
          break;
        }

        case "default":
        default:
          result = 0;
          break;
      }

      return isReversed ? -result : result;
    });
  }, [tournaments, tournamentSort, isReversed, career]);

  return {
    sortedTournaments,
    tournamentSort,
    setTournamentSort,
    isReversed,
    tournamentSortOptions: TOURNAMENT_SORT_OPTIONS,
  };
};
