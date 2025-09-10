import { useState } from "react";
import { Career } from "../../../interfaces/Career";
import { ModalType } from "../../../types/enums/ModalType";

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

  const openModal = (type: ModalType, career?: Career) => {
    if (career) setSelectedCareer(career);
    setActiveModal(type);
  };

  const closeModal = () => setActiveModal(ModalType.NONE);

  return {
    activeModal,
    selectedCareer,
    setSelectedCareer,
    openModal,
    closeModal,
  };
}
