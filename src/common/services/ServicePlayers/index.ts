import { PlayersCrudService } from "./PlayersCrudService";
import { PlayersContractService } from "./PlayersContractService";
import { PlayersStatsService } from "./PlayersStatsService";
import { PlayersGroupService } from "./PlayersGroupService";
import { PlayersMigrationService } from "./PlayersMigrationService";

export const ServicePlayers = {
  ...PlayersCrudService,
  ...PlayersContractService,
  ...PlayersStatsService,
  ...PlayersGroupService,
  ...PlayersMigrationService,
};
