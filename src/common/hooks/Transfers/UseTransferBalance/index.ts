import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { Players } from "../../../interfaces/playersInfo/players";
import { formatDisplayValue } from "../../../utils/FormatValue";
import { getSeasonDateRange } from "../../../utils/GetSeasonDateRange";

const getPlayersByDate = (
  players: Players[],
  career: Career,
  season: ClubData
) => {
  const { startDate, endDate } = getSeasonDateRange(
    season.seasonNumber,
    career.createdAt,
    career.nation
  );

  const signings = players.filter((p) => {
    const arrivalDate = p.contract?.[p.contract.length - 1]?.dataArrival;
    return (
      p.buy &&
      arrivalDate &&
      new Date(arrivalDate) >= startDate &&
      new Date(arrivalDate) <= endDate
    );
  });

  const sales = players.filter((p) => {
    const exitDate = p.contract?.[p.contract.length - 1]?.dataExit;
    return (
      p.sell &&
      exitDate &&
      new Date(exitDate) >= startDate &&
      new Date(exitDate) <= endDate
    );
  });

  return { signings, sales };
};

export const useTransferBalance = (career: Career, season: ClubData) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const { signings, sales } = useMemo(() => {
    if (isGeralPage) {
      const allPlayers = career.clubData.flatMap((s) => s.players);
      return {
        signings: allPlayers.filter((p) => p.buy),
        sales: allPlayers.filter((p) => p.sell),
      };
    }
    return getPlayersByDate(season.players, career, season);
  }, [career, season, isGeralPage]);

  const totalSpent = useMemo(
    () =>
      signings.reduce((acc, player) => {
        const contract = player.contract[player.contract.length - 1];
        return (
          acc + (typeof contract.buyValue === "number" ? contract.buyValue : 0)
        );
      }, 0),
    [signings]
  );

  const totalEarned = useMemo(
    () =>
      sales.reduce((acc, player) => {
        const contract = player.contract[player.contract.length - 1];
        return (
          acc +
          (typeof contract.sellValue === "number" ? contract.sellValue : 0)
        );
      }, 0),
    [sales]
  );

  const profit = useMemo(
    () => totalEarned - totalSpent,
    [totalEarned, totalSpent]
  );

  const content = [
    {
      value: formatDisplayValue(totalSpent),
      name: "Contratações: ",
      number: signings.length,
      color: "#c81419",
    },
    {
      value: formatDisplayValue(totalEarned),
      name: "Vendas: ",
      number: sales.length,
      color: "#0bb32a",
    },
    {
      value: formatDisplayValue(Math.abs(profit)),
      name: profit >= 0 ? "Lucro" : "Perda",
      color: profit >= 0 ? "#0bb32a" : "#c81419",
    },
  ];

  return { content };
};
