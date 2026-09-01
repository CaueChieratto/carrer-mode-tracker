import { ReactNode } from "react";
import { useForm } from "../../../../../../../../../common/hooks/UseForm";
import { Career } from "../../../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../../../common/interfaces/club/clubData";
import { TableRowData } from "../../../../../../../../../common/interfaces/Table";
import { AddTeamsToTableContext } from "../context";

type ProviderProps = {
  career: Career;
  season: ClubData;
  teamId?: string;
  teamToEdit?: TableRowData;
  onClose: () => void;
  children: ReactNode;
};

export const AddTeamsToTableProvider = ({
  career,
  season,
  teamId,
  teamToEdit,
  onClose,
  children,
}: ProviderProps) => {
  const form = useForm();

  return (
    <AddTeamsToTableContext.Provider
      value={{ career, season, teamId, teamToEdit, onClose, ...form }}
    >
      {children}
    </AddTeamsToTableContext.Provider>
  );
};
