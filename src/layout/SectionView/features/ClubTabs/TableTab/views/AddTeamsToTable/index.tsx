import { Career } from "../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import { TableRowData } from "../../../../../../../common/interfaces/Table";
import { TableTeamData } from "../../../../../../../common/interfaces/TableTeamData";
import { AddTeamsToTableProvider } from "./contexts/AddTeamsToTableContext";
import { AddTeamsToTableScreen } from "./screens/AddTeamsToTableScreen";

export type OptimisticTableData =
  | { type: "ADD_TABLE_TEAM"; team: TableTeamData }
  | { type: "UPDATE_TABLE_TEAM"; team: TableTeamData }
  | { type: "DELETE_TABLE_TEAM"; teamId: string };

type AddTeamsToTableProps = {
  career: Career;
  season: ClubData;
  teamId?: string;
  teamToEdit?: TableRowData;
  onClose: (data?: OptimisticTableData) => void;
};

export default function AddTeamsToTable(props: AddTeamsToTableProps) {
  return (
    <AddTeamsToTableProvider {...props}>
      <AddTeamsToTableScreen />
    </AddTeamsToTableProvider>
  );
}
