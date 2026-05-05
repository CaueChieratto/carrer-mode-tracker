import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { getSeasonDateRange } from "../../../../../../common/utils/GetSeasonDateRange";

const sortPlayersByDate = (
  players: Players[],
  isArrival: boolean,
  fallbackDate: Date,
) => {
  return players
    .sort((a, b) => {
      const contractA = a.contract || [];
      const contractB = b.contract || [];

      const cA =
        [...contractA]
          .reverse()
          .find((c) => (isArrival ? c.fromClub : c.leftClub)) ||
        contractA[contractA.length - 1] ||
        {};
      const cB =
        [...contractB]
          .reverse()
          .find((c) => (isArrival ? c.fromClub : c.leftClub)) ||
        contractB[contractB.length - 1] ||
        {};

      const dateA = (isArrival ? cA.dataArrival : cA.dataExit) || fallbackDate;
      const dateB = (isArrival ? cB.dataArrival : cB.dataExit) || fallbackDate;

      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 3);
};

export const useTransferData = (career: Career, season: ClubData) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const arrivals = useMemo(() => {
    if (isGeralPage) {
      const allPlayers = career.clubData.flatMap((s) => s.players || []);
      return sortPlayersByDate(
        allPlayers.filter((p) => p.contract?.some((c) => c.fromClub)),
        true,
        career.createdAt,
      );
    }
    const { startDate, endDate } = getSeasonDateRange(
      season.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const seasonArrivals = (season.players || []).filter((p) => {
      return p.contract?.some((c) => {
        if (!c.fromClub) return false;
        const arrivalDate = c.dataArrival || career.createdAt;
        return (
          new Date(arrivalDate) >= startDate && new Date(arrivalDate) <= endDate
        );
      });
    });
    return sortPlayersByDate(seasonArrivals, true, career.createdAt);
  }, [career, season, isGeralPage]);

  const departures = useMemo(() => {
    if (isGeralPage) {
      const allPlayers = career.clubData.flatMap((s) => s.players || []);
      return sortPlayersByDate(
        allPlayers.filter((p) => p.contract?.some((c) => c.leftClub)),
        false,
        career.createdAt,
      );
    }
    const { startDate, endDate } = getSeasonDateRange(
      season.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const seasonDepartures = (season.players || []).filter((p) => {
      return p.contract?.some((c) => {
        if (!c.leftClub) return false;
        const exitDate = c.dataExit || career.createdAt;
        return new Date(exitDate) >= startDate && new Date(exitDate) <= endDate;
      });
    });
    return sortPlayersByDate(seasonDepartures, false, career.createdAt);
  }, [career, season, isGeralPage]);

  return { arrivals, departures };
};
