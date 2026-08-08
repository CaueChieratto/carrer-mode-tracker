import { getContinentByCountry } from "../../../../../../../../common/services/GetContinentByCountry";
import { AcademyService } from "../../../../services/AcademyService";
import { PlayerForm } from "../../forms/components/PlayerForm";
import { PlayerDataPayload } from "../../forms/types/PlayerDataPayload";
import { TEXTS } from "./constants/TEXTS";
import { useAcademyContext } from "../../../../../contexts/AcademyContext/hooks/useAcademyContext";
import { getSeasonStartYear } from "../../../../utils/getSeasonStartYear";

type CreateAcademyPlayerFormProps = {
  onComplete: () => void;
};

export const CreateAcademyPlayerForm = ({
  onComplete,
}: CreateAcademyPlayerFormProps) => {
  const { career, seasonId } = useAcademyContext();

  const addPlayer = async (data: PlayerDataPayload) => {
    try {
      const [day, month] = data.arrivalDate.split("/");
      const startYear = getSeasonStartYear(career, seasonId);
      const continent = getContinentByCountry(career.nation);

      let seasonString = "";
      if (continent === "Europa") {
        const endYear = (startYear + 1).toString().slice(-2);
        seasonString = `${startYear.toString().slice(-2)}/${endYear}`;
      } else {
        seasonString = startYear.toString();
      }

      const finalArrivalDate = `${day}/${month} - ${seasonString}`;
      const playerData = { ...data, arrivalDate: finalArrivalDate };

      await AcademyService.addPlayerToAcademy(career.id, seasonId, playerData);
      onComplete();
    } catch (error) {
      console.error("Erro ao adicionar jogador:", error);
      alert("Falha ao salvar o jogador. Tente novamente.");
      throw error;
    }
  };

  return <PlayerForm texts={TEXTS} onSubmitData={addPlayer} />;
};
