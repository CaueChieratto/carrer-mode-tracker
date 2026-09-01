import { TableRowData } from "../../../common/interfaces/Table";

export type SectionScreen =
  | {
      key: "addMatches";
      matchesId?: string;
      seasonId?: string;
    }
  | {
      key: "addTeamsToTable";
      teamId?: string;
      seasonId?: string;
      teamToEdit?: TableRowData;
    }
  | {
      key: "addSquadPlayer";
      playerId?: string;
      seasonId?: string;
    }
  | {
      key: "transferPlayer";
      playerId: string;
      mode: "transfer" | "loan";
      seasonId?: string;
    }
  | {
      key: "addSeasonPlayer";
      playerId?: string;
      seasonId?: string;
    };
