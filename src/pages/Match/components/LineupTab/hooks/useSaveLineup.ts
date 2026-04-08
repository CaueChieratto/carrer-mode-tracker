import { useCallback } from "react";
import { ServiceLineup } from "../../../services/ServiceLineup";
import { SavedLineup } from "../../../types/Lineup";

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
    async (savedLineup: SavedLineup) => {
      if (!careerId || !seasonId) return;

      try {
        await ServiceLineup.saveLineupToMatch(
          careerId,
          seasonId,
          matchId,
          savedLineup,
        );
        alert("Formação salva com sucesso!");
      } catch {
        alert("Erro ao salvar a formação. Tente novamente.");
      }
    },
    [careerId, seasonId, matchId],
  );
};
