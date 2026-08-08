import { useState, useMemo } from "react";
import { AcademyPlayers } from "../../../interfaces/AcademyPlayers/AcademyPlayers";
import { isEuropeanSeason } from "../../../utils/isEuropeanSeason";
import { Career } from "../../../../../../../common/interfaces/Career";
import { getSeasonMonthWeight } from "../../../components/Player/components/PlayerDevelopment/utils/getSeasonMonthWeight";

export type PlayerSortOption =
  | "arrival-desc"
  | "overall-desc"
  | "potential-desc"
  | "age-asc";

export const useSortedPlayers = (players: AcademyPlayers[], career: Career) => {
  const [playerSort, setPlayerSort] =
    useState<PlayerSortOption>("arrival-desc");

  const sortedPlayers = useMemo(() => {
    const isEurope = isEuropeanSeason(career);
    return [...players].sort((a, b) => {
      switch (playerSort) {
        case "overall-desc":
          return b.overall - a.overall;
        case "potential-desc": {
          const potA = parseInt(a.potential.split("-")[1] || "0", 10);
          const potB = parseInt(b.potential.split("-")[1] || "0", 10);
          return potB - potA;
        }
        case "age-asc":
          return a.age - b.age;
        case "arrival-desc":
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
            return yearB - yearA;
          }

          const monthA = a.arrivalDate.split("/")[1]?.split(" ")[0] || "1";
          const monthB = b.arrivalDate.split("/")[1]?.split(" ")[0] || "1";
          const weightA = getSeasonMonthWeight(monthA, isEurope);
          const weightB = getSeasonMonthWeight(monthB, isEurope);

          if (weightA !== weightB) {
            return weightB - weightA;
          }

          const dayA = parseInt(a.arrivalDate.split("/")[0] || "1", 10);
          const dayB = parseInt(b.arrivalDate.split("/")[0] || "1", 10);

          return dayB - dayA;
        }
      }
    });
  }, [players, playerSort, career]);

  return { sortedPlayers, playerSort, setPlayerSort };
};
