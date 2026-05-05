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

  const { editPlayer, deletePlayer, sellPlayer, loanPlayer, returnLoanPlayer } =
    useEditSquadPlayer({
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
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
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
    dateExit: string,
    loanDuration?: string,
    wagePercentage?: string,
  ) => {
    setIsLoading(true);
    try {
      if (loanDuration && wagePercentage) {
        await loanPlayer(
          sellValue,
          toClub,
          dateExit,
          loanDuration,
          wagePercentage,
        );
      } else {
        await sellPlayer(sellValue, toClub, dateExit);
      }
    } catch (error) {
      console.error("Falha ao registrar saída do jogador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnLoanPlayer = async (returnDate: string) => {
    setIsLoading(true);
    try {
      await returnLoanPlayer(returnDate);
    } catch (error) {
      console.error("Falha ao retornar o jogador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleAddOrEditPlayer,
    handleDeletePlayer,
    handleSellPlayer,
    handleReturnLoanPlayer,
  };
};
