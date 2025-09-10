import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Players } from "../../../interfaces/playersInfo/players";
import { ServicePlayers } from "../../../services/ServicePlayers";

type UsePlayerStatsProps = {
  careerId: string;
  currentPlayers?: Players[];
  handleGoBack: () => void;
};

export const usePlayerStats = ({
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

        if (playerNameValue) {
          const playerToUpdate = currentPlayers?.find(
            (p) => p.name === playerNameValue
          );

          if (playerToUpdate) {
            await ServicePlayers.updatePlayerBallonDor(
              careerId,
              seasonId!,
              playerToUpdate.id,
              ballonDorValue
            );
          }
        }
      } catch (error) {
        console.error("Falha ao atualizar a Bola de Ouro:", error);
        alert("Falha ao atualizar a Bola de Ouro.");
      } finally {
        setIsLoading(false);
        handleGoBack();
      }
    },
    [careerId, seasonId, currentPlayers, handleGoBack]
  );

  return { handleStatsSave, isStatsLoading };
};
