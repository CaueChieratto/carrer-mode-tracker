import { useState, useEffect } from "react";
import { PlayerDataPayload } from "../../types/PlayerDataPayload";
import { PlayerFormTexts } from "../../types/PlayerFormTexts";
import { usePositionSelection } from "../usePositionSelection";
import { getFormRows } from "../../utils/getFormRows";
import { getFormattedArrivalDate } from "../../utils/getFormattedArrivalDate";
import { AcademyPlayersHistory } from "../../../../../interfaces/AcademyPlayers/AcademyPlayersHistory";
import { useAsyncForm } from "../../../../../hooks/useAsyncForm";
import { useAcademyContext } from "../../../../../../contexts/AcademyContext/hooks/useAcademyContext";
import { isEuropeanSeason } from "../../../../../utils/isEuropeanSeason";
import { getSeasonMonthWeight } from "../../../components/PlayerDevelopment/utils/getSeasonMonthWeight";

type UsePlayerFormProps = {
  texts: PlayerFormTexts;
  onSubmitData: (data: PlayerDataPayload) => Promise<void>;
  initialData?: Partial<PlayerDataPayload> & {
    evolutionHistory?: AcademyPlayersHistory[];
  };
  isEvolution?: boolean;
};

export const usePlayerForm = ({
  texts,
  onSubmitData,
  initialData,
  isEvolution,
}: UsePlayerFormProps) => {
  const { career } = useAcademyContext();

  const [nationality, setNationality] = useState<string>(
    initialData?.nationality || "",
  );

  const {
    sectorsList,
    sector,
    setSector,
    availablePositions,
    position,
    setPosition,
  } = usePositionSelection(initialData?.sector, initialData?.position);

  useEffect(() => {
    if (initialData?.sector) setSector(initialData.sector);
    if (initialData?.position) setPosition(initialData.position);
  }, [initialData, setSector, setPosition]);

  const parsePlayerData = (formData: FormData): Partial<PlayerDataPayload> => {
    const playerData: Partial<PlayerDataPayload> = {};
    if (formData.has("name")) playerData.name = formData.get("name") as string;
    if (formData.has("nationality"))
      playerData.nationality = formData.get("nationality") as string;
    if (formData.has("age")) playerData.age = Number(formData.get("age"));

    const shirtValue = formData.get("shirtNumber");
    if (shirtValue && shirtValue.toString().trim() !== "") {
      playerData.shirtNumber = Number(shirtValue);
    }

    if (formData.has("height"))
      playerData.height = Number(formData.get("height"));
    if (formData.has("weight"))
      playerData.weight = Number(formData.get("weight"));
    if (formData.has("sector"))
      playerData.sector = formData.get("sector") as string;
    if (formData.has("position"))
      playerData.position = formData.get("position") as string;
    if (formData.has("overall"))
      playerData.overall = Number(formData.get("overall"));
    if (formData.has("potential"))
      playerData.potential = formData.get("potential") as string;
    if (formData.has("annotations"))
      playerData.annotations = (formData.get("annotations") as string) || "";
    if (formData.has("arrivalDate"))
      playerData.arrivalDate = formData.get("arrivalDate") as string;
    if (formData.has("evolutionDate"))
      playerData.evolutionDate = formData.get("evolutionDate") as string;

    return playerData;
  };

  const handleCustomSubmit = async (parsedData: Partial<PlayerDataPayload>) => {
    const hasRecruitmentThisSeason = initialData?.evolutionHistory?.some(
      (event) =>
        event.description === "Jogador recrutado para a categoria de base.",
    );

    if (
      isEvolution &&
      hasRecruitmentThisSeason &&
      parsedData.evolutionDate &&
      initialData?.arrivalDate
    ) {
      const arrDateStr = getFormattedArrivalDate(initialData.arrivalDate);
      const evDateStr = parsedData.evolutionDate;
      if (arrDateStr.length === 5 && evDateStr.length === 5) {
        const [arrDay, arrMonth] = arrDateStr.split("/").map(Number);
        const [evDay, evMonth] = evDateStr.split("/").map(Number);

        const isEurope = isEuropeanSeason(career);
        const arrWeight = getSeasonMonthWeight(arrMonth, isEurope);
        const evWeight = getSeasonMonthWeight(evMonth, isEurope);

        if (
          evWeight < arrWeight ||
          (evWeight === arrWeight && evDay < arrDay)
        ) {
          alert(
            `A data da evolução não pode ser anterior à data de chegada (${arrDateStr}).`,
          );
          throw new Error("Invalid evolution date");
        }
      }
    }
    await onSubmitData(parsedData as PlayerDataPayload);
  };

  const { isLoading, submit } = useAsyncForm<Partial<PlayerDataPayload>>(
    handleCustomSubmit,
    parsePlayerData,
  );

  const formRows = getFormRows({
    texts,
    initialData,
    sectorsList,
    availablePositions,
    sector,
    position,
    setSector,
    setPosition,
    isEvolution,
    nationality,
    setNationality,
  });

  return { isLoading, sector, position, submit, formRows };
};
