import { useState } from "react";
import { Career } from "../../../interfaces/Career";
import { useSave } from "../UseSave";
import { formatSeason } from "../../../utils/FormatSeason";
import { getContinentByCountry } from "../../../services/GetContinentByCountry";
import { useLeagueOptions } from "../../UseLeagueOptions";

type useAddTrophiesProps = {
  setView: React.Dispatch<React.SetStateAction<"titles" | "add">>;
  careerId: string;
  country: string;
  selectedCareer: Career;
  setSelectedCareer: React.Dispatch<React.SetStateAction<Career>>;
};

export const useAddTrophies = ({
  setView,
  careerId,
  country,
  selectedCareer,
  setSelectedCareer,
}: useAddTrophiesProps) => {
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [season, setSeason] = useState("");

  const continent = getContinentByCountry(country);
  const leaguesOptions = useLeagueOptions(country);

  const { saveTrophies } = useSave({
    setView,
    selectedCareer,
    setSelectedCareer,
  });

  const handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeason(formatSeason(e.target.value, continent));
  };

  return {
    selectedLeague,
    setSelectedLeague,
    season,
    handleSeasonChange,
    leaguesOptions,
    saveTrophies,
    careerId,
  };
};
