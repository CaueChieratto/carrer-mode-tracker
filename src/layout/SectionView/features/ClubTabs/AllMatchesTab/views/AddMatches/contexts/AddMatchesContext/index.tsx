import { ReactNode } from "react";
import { useForm } from "../../../../../../../../../common/hooks/UseForm";
import { Career } from "../../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../../common/interfaces/club/clubData";
import { AddMatchesContext } from "../context";

type ProviderProps = {
  career: Career;
  season: ClubData;
  matchesId?: string;
  onClose: () => void;
  children: ReactNode;
};

export const AddMatchesProvider = ({
  career,
  season,
  matchesId,
  onClose,
  children,
}: ProviderProps) => {
  const form = useForm();
  return (
    <AddMatchesContext.Provider
      value={{ career, season, matchesId, onClose, ...form }}
    >
      {children}
    </AddMatchesContext.Provider>
  );
};
