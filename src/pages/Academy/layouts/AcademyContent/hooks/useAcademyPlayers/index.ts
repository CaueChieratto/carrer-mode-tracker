import { useState, useCallback, useEffect } from "react";
import { AcademyService } from "../../services/AcademyService";
import { AcademyPlayers } from "../../interfaces/AcademyPlayers/AcademyPlayers";
import { Career } from "../../../../../../common/interfaces/Career";

export const useAcademyPlayers = (
  career: Career,
  seasonId: string,
  isGeral?: boolean,
) => {
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
        if (isGeral) {
          const promises = career.clubData.map((season) =>
            AcademyService.getPlayersAcademy(career.id, season.id),
          );
          const results = await Promise.all(promises);

          const allPlayersMap = new Map<string, AcademyPlayers>();
          results.forEach((data) => {
            data.forEach((player) => allPlayersMap.set(player.id, player));
          });

          const aggregatedPlayers = Array.from(allPlayersMap.values());
          setAllPlayersAcademy(aggregatedPlayers);

          const activePlayers = aggregatedPlayers.filter(
            (player) =>
              player.status !== "released" && player.status !== "promoted",
          );
          setPlayersAcademy(activePlayers);
        } else {
          const data = await AcademyService.getPlayersAcademy(
            career.id,
            seasonId,
          );
          setAllPlayersAcademy(data);
          const activePlayers = data.filter(
            (player) =>
              player.status !== "released" && player.status !== "promoted",
          );
          setPlayersAcademy(activePlayers);
        }
      } catch (error) {
        console.error("Erro ao carregar jogadores da academia:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [career, seasonId, isGeral],
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
