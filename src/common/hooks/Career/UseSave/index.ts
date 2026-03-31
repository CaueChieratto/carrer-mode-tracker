import { Dispatch, FormEvent, SetStateAction } from "react";
import { UseCreateCareer } from "../UseCreateCareer";
import { Career } from "../../../interfaces/Career";
import { ServiceCareer } from "../../../services/ServiceCareer";

type useSaveProps = {
  setView?: (view: "titles" | "add" | "menu") => void;
  selectedCareer?: Career;
  setSelectedCareer?: Dispatch<SetStateAction<Career>>;
};

export function useSave({
  setView,
  selectedCareer,
  setSelectedCareer,
}: useSaveProps) {
  const saveCareer = async (
    event: React.FormEvent<HTMLFormElement>,
    createdAtInput: string,
  ) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const club = String(data.get("club") || "").trim();
    const nation = String(data.get("nation") || "").trim();
    const manager = String(data.get("manager") || "").trim();

    if (!club || !nation || !manager) {
      throw new Error("Preencha todos os campos!");
    }

    try {
      const career = await UseCreateCareer({
        club,
        manager,
        nation,
        createdAt: createdAtInput,
      });

      await ServiceCareer.saveCareer(career);
    } catch (error) {
      console.error("Erro ao salvar carreira:", error);
      throw error;
    }
  };

  const saveTrophies = async (
    event: FormEvent<HTMLFormElement>,
    careerId: string,
    selectedLeague: string,
    seasonName: string,
  ) => {
    event.preventDefault();

    if (!selectedLeague) {
      alert("Selecione uma liga!");
      return;
    }

    if (!seasonName) {
      alert("Erro: Temporada não identificada!");
      return;
    }

    const seasons = [seasonName];

    const updatedTrophies = await ServiceCareer.saveClubTrophie(
      careerId,
      selectedLeague,
      seasons,
    );

    if (selectedCareer && setSelectedCareer) {
      setSelectedCareer({
        ...selectedCareer,
        trophies: updatedTrophies,
      });
    }

    setView?.("menu");
  };

  return { saveCareer, saveTrophies };
}
