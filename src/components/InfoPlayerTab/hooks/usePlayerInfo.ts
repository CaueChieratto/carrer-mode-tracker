import { useMemo } from "react";
import { Players } from "../../../common/interfaces/playersInfo/players";
import { Career } from "../../../common/interfaces/Career";

export const usePlayerInfo = (player?: Players, career?: Career) => {
  const latestContract = useMemo(() => {
    if (!player?.contract?.length) return null;
    return player.contract[player.contract.length - 1];
  }, [player]);

  const { buyValue, fromClub, dataArrival, sellValue, leftClub, dataExit } =
    latestContract || {};

  const numericBuyValue = Number(buyValue) || 0;
  const numericSellValue = Number(sellValue) || 0;

  const getPlayerAgeForTransaction = (transactionDate: Date | null) => {
    if (!transactionDate || !career || !player) return player?.age;

    const transactionYear = transactionDate.getFullYear();
    const season = career.clubData.find((s) => {
      const seasonYear =
        new Date(career.createdAt).getFullYear() + s.seasonNumber - 1;
      return seasonYear === transactionYear;
    });

    if (season) {
      const playerInSeason = season.players.find((p) => p.id === player.id);
      return playerInSeason ? playerInSeason.age : player.age;
    }

    return player.age;
  };

  const hasBeenBought = !!fromClub;
  const hasBeenSold = !!leftClub;

  return {
    player,
    career,
    latestContract,
    numericBuyValue,
    numericSellValue,
    hasBeenBought,
    hasBeenSold,
    getPlayerAgeForTransaction,
    dataArrival,
    dataExit,
    fromClub,
    leftClub,
  };
};
