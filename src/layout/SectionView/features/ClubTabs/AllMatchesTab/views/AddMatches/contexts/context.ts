import { createContext, useContext } from "react";
import { useForm } from "../../../../../../../../common/hooks/UseForm";
import { Career } from "../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";

type UseFormReturn = ReturnType<typeof useForm>;

export type AddMatchesContextType = UseFormReturn & {
  career: Career;
  season: ClubData;
  matchesId?: string;
  onClose: () => void;
};

export const AddMatchesContext = createContext<
  AddMatchesContextType | undefined
>(undefined);

export const useAddMatchesContext = () => {
  const context = useContext(AddMatchesContext);
  if (!context) {
    throw new Error(
      "useAddMatchesContext deve ser usado dentro de um AddMatchesProvider",
    );
  }
  return context;
};
