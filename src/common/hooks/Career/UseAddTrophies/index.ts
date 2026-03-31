import { useState, useMemo } from "react";
import { Career } from "../../../interfaces/Career";
import { useSave } from "../UseSave";
import { ClubData } from "../../../interfaces/club/clubData";

type useAddTrophiesProps = {
  setView: React.Dispatch<React.SetStateAction<"titles" | "add" | "menu">>;
  careerId: string;
  selectedCareer: Career;
  setSelectedCareer: React.Dispatch<React.SetStateAction<Career>>;
  season: ClubData;
};

export const useAddTrophies = ({
  setView,
  careerId,
  selectedCareer,
  setSelectedCareer,
  season,
}: useAddTrophiesProps) => {
  const [selectedLeague, setSelectedLeague] = useState<string>("");

  const leaguesOptions = useMemo(() => {
    return season?.leagues?.map((l) => l.name) || [];
  }, [season]);

  const { saveTrophies } = useSave({
    setView,
    selectedCareer,
    setSelectedCareer,
  });

  return {
    selectedLeague,
    setSelectedLeague,
    leaguesOptions,
    saveTrophies,
    careerId,
  };
};
