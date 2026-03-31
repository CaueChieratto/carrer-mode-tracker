import { useState } from "react";
import { Career } from "../../../interfaces/Career";
import { ModalType } from "../../../types/enums/ModalType";
import { ClubData } from "../../../interfaces/club/clubData";

export function useModalManager() {
  const initialCareer: Career = {
    id: "",
    clubName: "",
    managerName: "",
    createdAt: new Date(),
    teamBadge: "",
    nation: "",
    colorsTeams: [],
    trophies: [],
    clubData: [],
  };

  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [selectedCareer, setSelectedCareer] = useState<Career>(initialCareer);
  const [selectedSeason, setSelectedSeason] = useState<ClubData | null>(null);

  const openModal = (type: ModalType, career?: Career, season?: ClubData) => {
    if (career) setSelectedCareer(career);
    if (season) setSelectedSeason(season);
    setActiveModal(type);
  };

  const closeModal = () => setActiveModal(ModalType.NONE);

  return {
    activeModal,
    selectedCareer,
    setSelectedCareer,
    selectedSeason,
    openModal,
    closeModal,
  };
}
