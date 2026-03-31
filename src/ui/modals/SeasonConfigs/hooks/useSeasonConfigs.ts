import { Dispatch, SetStateAction, useState } from "react";
import { useClubColors } from "../../../../common/hooks/Colors/UseClubColors";
import { Career } from "../../../../common/interfaces/Career";
import { ColorsService } from "../../../../common/services/ColorsService";
import { League } from "../../../../common/utils/Leagues";
import { SeasonView } from "../types/SeasonView";

type UseSeasonConfigsParams = {
  career: Career;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
};

type UseSeasonConfigsReturn = {
  view: SeasonView;
  setView: (view: SeasonView) => void;
  currentSeasonId: string;
  country: string;
  selectedLeagues: League[];
  setSelectedLeagues: Dispatch<SetStateAction<League[]>>;
  clubColor: string;
  darkClubColor: string;
  canProceed: boolean;
};

export const useSeasonConfigs = ({
  career,
}: UseSeasonConfigsParams): UseSeasonConfigsReturn => {
  const currentSeason = career.clubData[career.clubData.length - 1];
  const currentSeasonId = currentSeason?.id || "";
  const country = career.nation;

  const [view, setView] = useState<SeasonView>("menu");
  const [selectedLeagues, setSelectedLeagues] = useState<League[]>(
    currentSeason?.leagues || [],
  );

  const { clubColor, darkClubColor } = useClubColors(
    ColorsService.getColorSaved(career.id) || "#ffffff",
  );

  const isFirstSeason = career.clubData?.length <= 1;
  const canProceed = !isFirstSeason || selectedLeagues.length > 0;

  return {
    view,
    setView,
    currentSeasonId,
    country,
    selectedLeagues,
    setSelectedLeagues,
    clubColor,
    darkClubColor,
    canProceed,
  };
};
