import { useState } from "react";
import { ServicePlayers } from "../../../services/ServicePlayers";
import { LeagueStats } from "../../../interfaces/playersStats/leagueStats";

type UseAddLeagueStatsProps = {
  careerId: string;
  seasonId: string;
  onSuccess?: () => void;
};

export const useAddLeagueStats = ({
  careerId,
  seasonId,
  onSuccess,
}: UseAddLeagueStatsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const addLeagueStats = async (
    playerId: string,
    leagueStats: LeagueStats[]
  ) => {
    setIsLoading(true);
    try {
      await ServicePlayers.addLeagueStatsToPlayer(
        careerId,
        seasonId,
        playerId,
        leagueStats
      );
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Erro ao adicionar estatísticas da liga:", error);
      throw new Error("Falha ao adicionar estatísticas da liga.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, addLeagueStats };
};
