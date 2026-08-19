import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Players } from "../../../interfaces/playersInfo/players";
import { ServicePlayers } from "../../../services/ServicePlayers";
import { Career } from "../../../interfaces/Career";

type UsePlayerStatsProps = {
  career: Career;
  careerId: string;
  currentPlayers?: Players[];
  handleGoBack: () => void;
};

export const usePlayerStats = ({
  career,
  careerId,
  currentPlayers,
  handleGoBack,
}: UsePlayerStatsProps) => {
  const { seasonId } = useParams<{ seasonId: string }>();
  const [isStatsLoading, setIsLoading] = useState(false);

  const handleStatsSave = useCallback(
    async (formData: FormData) => {
      setIsLoading(true);
      try {
        const ballonDorValue = formData.get("ballonDor") === "true" ? 1 : 0;
        const playerNameValue = formData.get("playerName") as string;
        const draftedLeaguesStr = formData.get("draftedLeagues") as string;

        if (playerNameValue) {
          const playerToUpdate = currentPlayers?.find(
            (p) => p.name === playerNameValue,
          );

          if (playerToUpdate) {
            await ServicePlayers.updatePlayerBallonDor(
              careerId,
              seasonId!,
              playerToUpdate.id,
              ballonDorValue,
            );

            if (draftedLeaguesStr) {
              const leaguesToSave = JSON.parse(draftedLeaguesStr);
              await ServicePlayers.updatePlayerStatsLeagues(
                career,
                seasonId!,
                playerToUpdate.id,
                leaguesToSave,
              );

              localStorage.removeItem(
                `stats_backup_${career.id}_${seasonId}_${playerToUpdate.id}`,
              );
            }
          }
        }
      } catch (error) {
        console.error("Falha ao salvar o desempenho:", error);
        alert("Falha ao salvar o desempenho.");
      } finally {
        setIsLoading(false);
        handleGoBack();
      }
    },
    [career, careerId, seasonId, currentPlayers, handleGoBack],
  );

  return { handleStatsSave, isStatsLoading };
};
