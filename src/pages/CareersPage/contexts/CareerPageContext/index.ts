import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { ButtonConfig } from "../../constants/CareerCardButtons";
import { Career } from "../../../../common/interfaces/Career";
import { ModalType } from "../../../../common/types/enums/ModalType";

interface DragParams {
  element: HTMLElement;
  clientX: number;
  clientY: number;
  pointerId: number;
}

interface CareerPageContextProps {
  onOpenModal: (modal: ModalType, career?: Career) => void;
  setSelectedCareer: Dispatch<SetStateAction<Career>>;
  onDragStart: (params: DragParams, career: Career) => void;
  buttons: ButtonConfig[];
  requestRemoval: (
    careerId: string,
    clubName: string,
    managerName: string,
    groupId: string,
  ) => void;
}

export const CareerPageContext = createContext<
  CareerPageContextProps | undefined
>(undefined);

export const useCareerPage = () => {
  const context = useContext(CareerPageContext);
  if (!context) {
    throw new Error(
      "useCareerPage deve ser usado dentro de um CareerPageContext.Provider",
    );
  }
  return context;
};

export const CareerGroupContext = createContext<string | null>(null);

export const useCareerGroup = () => useContext(CareerGroupContext);
