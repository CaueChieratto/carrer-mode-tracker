import { mapFormDataToPlayerData } from "../../../helpers/Mappers";
import {
  validateMonetaryInput,
  validateRequiredFields,
  validateCaptainLimit,
} from "../../../helpers/Validators";
import { Career } from "../../../interfaces/Career";
import { ClubData } from "../../../interfaces/club/clubData";
import { Players } from "../../../interfaces/playersInfo/players";
import { ServicePlayers } from "../../../services/ServicePlayers";

type UseAddSquadPlayerProps = {
  careerId: string;
  seasonId: string;
  onPlayerAdded: () => void;
  currentPlayers?: Players[];
  career: Career;
  season: ClubData;
};

export const useAddSquadPlayer = ({
  careerId,
  seasonId,
  onPlayerAdded,
  currentPlayers,
  career,
  season,
}: UseAddSquadPlayerProps) => {
  const addPlayer = async (formData: FormData) => {
    validateMonetaryInput(
      formData.get("playerValue") as string,
      "Valor do Jogador"
    );
    validateMonetaryInput(
      formData.get("buyValue") as string,
      "Valor da Compra"
    );
    validateMonetaryInput(
      formData.get("salary") as string,
      "Salário (Semanal)"
    );
    validateRequiredFields(formData);

    const isBecomingCaptain = (formData.get("isCaptain") as string) === "true";
    validateCaptainLimit(isBecomingCaptain, undefined, currentPlayers);

    const playerData = mapFormDataToPlayerData(
      formData,
      career,
      season
    ) as Omit<Players, "id">;

    try {
      await ServicePlayers.addPlayerToSeason(careerId, seasonId, playerData);
      onPlayerAdded();
    } catch (error) {
      console.error("Erro ao adicionar jogador:", error);
      throw new Error("Falha ao adicionar jogador.");
    }
  };

  return { addPlayer };
};
