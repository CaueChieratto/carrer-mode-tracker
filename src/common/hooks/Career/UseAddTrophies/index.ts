import { useState, useMemo, useEffect } from "react";
import { Career } from "../../../interfaces/Career";
import { useSave } from "../UseSave";
import { ClubData } from "../../../interfaces/club/clubData";

type useAddTrophiesProps = {
  setView: React.Dispatch<React.SetStateAction<"titles" | "add" | "menu">>;
  careerId: string;
  selectedCareer: Career;
  setSelectedCareer: React.Dispatch<React.SetStateAction<Career>>;
  season: ClubData;
  seasonName: string;
};

export const useAddTrophies = ({
  setView,
  careerId,
  selectedCareer,
  setSelectedCareer,
  season,
  seasonName,
}: useAddTrophiesProps) => {
  const [selectedTrophies, setSelectedTrophies] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState<string>("");

  useEffect(() => {
    const alreadySaved =
      selectedCareer.trophies
        ?.filter((t) => t.seasons?.includes(seasonName))
        .map((t) => t.leagueName) || [];

    setSelectedTrophies(alreadySaved);
  }, [selectedCareer.trophies, seasonName]);

  const leaguesOptions = useMemo(() => {
    const allLeagues = season?.leagues?.map((l) => l.name) || [];
    return allLeagues.filter((name) => !selectedTrophies.includes(name));
  }, [season, selectedTrophies]);

  const addTrophy = (trophyName: string) => {
    if (trophyName && !selectedTrophies.includes(trophyName)) {
      setSelectedTrophies([...selectedTrophies, trophyName]);
    }
    setSelectValue("");
  };

  const removeTrophy = (trophyName: string) => {
    setSelectedTrophies(selectedTrophies.filter((t) => t !== trophyName));
  };

  const { saveTrophies, isSaving } = useSave({
    setView,
    selectedCareer,
    setSelectedCareer,
  });

  return {
    selectedTrophies,
    selectValue,
    addTrophy,
    removeTrophy,
    leaguesOptions,
    saveTrophies,
    careerId,
    isSaving,
  };
};
