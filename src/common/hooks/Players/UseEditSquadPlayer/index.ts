import { mapFormDataToPlayerData } from "../../../helpers/Mappers";
import {
  validateCaptainLimit,
  validateMonetaryInput,
  validateRequiredFields,
} from "../../../helpers/Validators";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { Players } from "../../../interfaces/playersInfo/players";
import { ServicePlayers } from "../../../services/ServicePlayers";

type UseEditSquadPlayerProps = {
  careerId: string;
  seasonId: string;
  playerId: string;
  onPlayerEdited: () => void;
  currentPlayers?: Players[];
  career: Career;
  season: ClubData;
};

export const useEditSquadPlayer = ({
  careerId,
  seasonId,
  playerId,
  currentPlayers,
  onPlayerEdited,
  career,
  season,
}: UseEditSquadPlayerProps) => {
  const editPlayer = async (formData: FormData) => {
    validateMonetaryInput(
      formData.get("playerValue") as string,
      "Valor do Jogador"
    );
    validateMonetaryInput(
      formData.get("salary") as string,
      "Salário (Semanal)"
    );
    validateRequiredFields(formData);

    const isBecomingCaptain = (formData.get("isCaptain") as string) === "true";
    const playerBeingEdited = currentPlayers?.find((p) => p.id === playerId);
    validateCaptainLimit(isBecomingCaptain, playerBeingEdited, currentPlayers);

    const updatedPlayerData = mapFormDataToPlayerData(formData, career, season);
    delete updatedPlayerData.buy;
    delete updatedPlayerData.statsLeagues;
    delete updatedPlayerData.ballonDor;

    try {
      await ServicePlayers.editPlayerInSeason(
        careerId,
        seasonId,
        playerId,
        updatedPlayerData
      );
      onPlayerEdited();
    } catch (error) {
      console.error("Erro ao editar jogador:", error);
      throw new Error("Falha ao editar jogador.");
    }
  };

  const sellPlayer = async (
    sellValue: string,
    toClub: string,
    dateExit: string
  ) => {
    try {
      await ServicePlayers.sellPlayerFromSeason(
        careerId,
        seasonId,
        playerId,
        sellValue,
        toClub,
        dateExit
      );
      onPlayerEdited();
    } catch (error) {
      console.error("Erro ao vender jogador:", error);
      throw new Error("Falha ao vender jogador.");
    }
  };

  const deletePlayer = async () => {
    try {
      await ServicePlayers.deletePlayerFromSeason(careerId, seasonId, playerId);
      onPlayerEdited();
    } catch (error) {
      console.error("Erro ao deletar jogador:", error);
      throw new Error("Falha ao deletar jogador.");
    }
  };

  return { editPlayer, deletePlayer, sellPlayer };
};
