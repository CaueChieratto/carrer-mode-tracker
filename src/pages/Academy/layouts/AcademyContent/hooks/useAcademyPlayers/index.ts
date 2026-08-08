import { useState, useCallback, useEffect } from "react";
import { AcademyService } from "../../services/AcademyService";
import { AcademyPlayers } from "../../interfaces/AcademyPlayers/AcademyPlayers";

export const useAcademyPlayers = (careerId: string, seasonId: string) => {
  const [playersAcademy, setPlayersAcademy] = useState<AcademyPlayers[]>([]);
  const [allPlayersAcademy, setAllPlayersAcademy] = useState<AcademyPlayers[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlayers = useCallback(
    async (isSilentUpdate = false) => {
      if (!isSilentUpdate) {
        setIsLoading(true);
      }
      try {
        const data = await AcademyService.getPlayersAcademy(careerId, seasonId);

        setAllPlayersAcademy(data);

        const activePlayers = data.filter(
          (player) =>
            player.status !== "released" && player.status !== "promoted",
        );
        setPlayersAcademy(activePlayers);
      } catch (error) {
        console.error("Erro ao carregar jogadores da academia:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [careerId, seasonId],
  );

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    playersAcademy,
    allPlayersAcademy,
    isLoading,
    setPlayersAcademy,
    refetchPlayers: fetchPlayers,
  };
};
