import { useCallback } from "react";
import { ServiceSeasons } from "../../../services/ServiceSeasons";

export const useSeasons = (careerId: string) => {
  const handleNavigateToSeason = useCallback(
    (seasonId: string) => {
      window.location.href = `/Career/${careerId}/Season/${seasonId}`;
    },
    [careerId]
  );

  const handleDeleteSeason = useCallback(
    async (seasonId: string, seasonNumber: number) => {
      const confirmed = window.confirm(
        `Deseja deletar permanentemente a temporada ${seasonNumber}?`
      );

      if (!confirmed) return;

      try {
        await ServiceSeasons.deleteSeason(careerId, seasonId);
      } catch (error) {
        console.error("Erro ao excluir temporada:", error);
        alert("Falha ao excluir a temporada.");
      }
    },
    [careerId]
  );

  const handleNavigateToGeral = useCallback((careerId: string) => {
    window.location.href = `/Career/${careerId}/Geral`;
  }, []);

  return {
    handleNavigateToSeason,
    handleDeleteSeason,
    handleNavigateToGeral,
  };
};
