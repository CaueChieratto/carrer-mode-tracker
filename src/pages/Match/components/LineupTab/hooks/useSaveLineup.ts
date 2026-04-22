import { useCallback } from "react";
import { ServiceLineup } from "../../../services/ServiceLineup";
import { SavedLineup } from "../../../types/Lineup";
import { PlayerMatchStat } from "../../../../../components/AllMatchesTab/types/PlayerMatchStat";

type UseSaveLineupParams = {
  careerId?: string;
  seasonId?: string;
  matchId: string;
};

export const useSaveLineup = ({
  careerId,
  seasonId,
  matchId,
}: UseSaveLineupParams) => {
  return useCallback(
    async (savedLineup: SavedLineup, playerStats: PlayerMatchStat[]) => {
      if (!careerId || !seasonId) return;

      try {
        await ServiceLineup.saveLineupToMatch(
          careerId,
          seasonId,
          matchId,
          savedLineup,
          playerStats,
        );
      } catch {
        alert("Erro ao salvar a formação. Tente novamente.");
      }
    },
    [careerId, seasonId, matchId],
  );
};
