import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { Players } from "../../../interfaces/playersInfo/players";
import { getSeasonDateRange } from "../../../utils/GetSeasonDateRange";

const sortPlayersByDate = (
  players: Players[],
  dateField: "dataArrival" | "dataExit"
) => {
  return players
    .sort((a, b) => {
      const dateA = a.contract?.[a.contract.length - 1]?.[dateField];
      const dateB = b.contract?.[b.contract.length - 1]?.[dateField];
      if (!dateA || !dateB) return 0;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);
};

export const useTransferData = (career: Career, season: ClubData) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const arrivals = useMemo(() => {
    if (isGeralPage) {
      const allPlayers = career.clubData.flatMap((s) => s.players);
      return sortPlayersByDate(
        allPlayers.filter((p) => p.buy),
        "dataArrival"
      );
    }

    const { startDate, endDate } = getSeasonDateRange(
      season.seasonNumber,
      career.createdAt,
      career.nation
    );

    const seasonArrivals = season.players.filter((p) => {
      const arrivalDate = p.contract?.[p.contract.length - 1]?.dataArrival;
      return (
        p.buy &&
        arrivalDate &&
        new Date(arrivalDate) >= startDate &&
        new Date(arrivalDate) <= endDate
      );
    });
    return sortPlayersByDate(seasonArrivals, "dataArrival");
  }, [career, season, isGeralPage]);

  const departures = useMemo(() => {
    if (isGeralPage) {
      const allPlayers = career.clubData.flatMap((s) => s.players);
      return sortPlayersByDate(
        allPlayers.filter((p) => p.sell),
        "dataExit"
      );
    }

    const { startDate, endDate } = getSeasonDateRange(
      season.seasonNumber,
      career.createdAt,
      career.nation
    );

    const seasonDepartures = season.players.filter((p) => {
      const exitDate = p.contract?.[p.contract.length - 1]?.dataExit;
      return (
        p.sell &&
        exitDate &&
        new Date(exitDate) >= startDate &&
        new Date(exitDate) <= endDate
      );
    });

    return sortPlayersByDate(seasonDepartures, "dataExit");
  }, [career, season, isGeralPage]);

  return { arrivals, departures };
};
