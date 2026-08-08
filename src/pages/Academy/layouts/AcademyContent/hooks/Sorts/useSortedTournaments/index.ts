import { useState, useMemo } from "react";
import { AcademyTournaments } from "../../../interfaces/AcademyTournaments/AcademyTournaments";

export type TournamentSortOption = "date-asc" | "matches-desc";

export const useSortedTournaments = (tournaments: AcademyTournaments[]) => {
  const [tournamentSort, setTournamentSort] =
    useState<TournamentSortOption>("date-asc");

  const sortedTournaments = useMemo(() => {
    return [...tournaments].sort((a, b) => {
      switch (tournamentSort) {
        case "matches-desc":
          return (b.matches?.length || 0) - (a.matches?.length || 0);
        case "date-asc":
        default: {
          const partsA = (a.date || "01/01/2000").split("/");
          const partsB = (b.date || "01/01/2000").split("/");

          const yearA = parseInt(partsA[2] || "0", 10);
          const yearB = parseInt(partsB[2] || "0", 10);

          if (yearA !== yearB) {
            return yearA - yearB;
          }

          const monthA = parseInt(partsA[1] || "1", 10);
          const monthB = parseInt(partsB[1] || "1", 10);

          if (monthA !== monthB) {
            return monthA - monthB;
          }

          const dayA = parseInt(partsA[0] || "1", 10);
          const dayB = parseInt(partsB[0] || "1", 10);

          return dayA - dayB;
        }
      }
    });
  }, [tournaments, tournamentSort]);

  return { sortedTournaments, tournamentSort, setTournamentSort };
};
