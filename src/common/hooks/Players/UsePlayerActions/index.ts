import { useState } from "react";
import { Players } from "../../../interfaces/playersInfo/players";
import { useAddSquadPlayer } from "../UseAddSquadPlayer";
import { useEditSquadPlayer } from "../UseEditSquadPlayer";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";

type UsePlayerActionsProps = {
  careerId: string;
  seasonId: string;
  player?: Players;
  currentPlayers?: Players[];
  onSuccess: () => void;
  career: Career;
  season: ClubData;
};

export const usePlayerActions = ({
  careerId,
  seasonId,
  player,
  currentPlayers,
  onSuccess,
  career,
  season,
}: UsePlayerActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const { addPlayer } = useAddSquadPlayer({
    careerId,
    seasonId,
    onPlayerAdded: onSuccess,
    currentPlayers,
    career,
    season,
  });

  const { editPlayer, deletePlayer, sellPlayer } = useEditSquadPlayer({
    careerId,
    seasonId,
    playerId: player?.id ?? "",
    onPlayerEdited: onSuccess,
    currentPlayers,
    career,
    season,
  });

  const handleAddOrEditPlayer = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (player) {
        await editPlayer(formData);
      } else {
        await addPlayer(formData);
      }
    } catch (error: unknown) {
      alert(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlayer = async () => {
    setIsLoading(true);
    try {
      await deletePlayer();
    } catch (error) {
      console.error("Falha ao deletar o jogador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellPlayer = async (
    sellValue: string,
    toClub: string,
    dateExit: string
  ) => {
    setIsLoading(true);
    try {
      await sellPlayer(sellValue, toClub, dateExit);
    } catch (error) {
      console.error("Falha ao vender o jogador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAddOrEditPlayer,
    handleDeletePlayer,
    handleSellPlayer,
  };
};
