import { createContext, useContext } from "react";
import { Career } from "../../../../../../../common/interfaces/Career";
import { SectionScreen } from "../../../../../config/screens";

type MatchesContextType = {
  career: Career;
  isGeralPage: boolean;
  onAddBadge?: (teamName: string) => void;
  onOpenScreen?: (screen: SectionScreen) => void;
};

export const MatchesContext = createContext<MatchesContextType | undefined>(
  undefined,
);

export const useMatchesContext = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error(
      "useMatchesContext deve ser usado dentro de um MatchesProvider",
    );
  }
  return context;
};
