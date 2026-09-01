import type { Match } from "../../../../../../common/interfaces/Match";
import type { SavedLineup } from "../../../../../../common/interfaces/Lineup";
import { getLineupPlayerIds } from "../getLineupPlayerIds";

export const buildLineupStatsUpdate = (
  lineup: SavedLineup,
  playerStats: Match["playerStats"],
) => {
  const activePlayerIds = getLineupPlayerIds(lineup);
  const currentPlayerStats = playerStats || [];

  const updatedPlayerStats = currentPlayerStats.filter((stat) =>
    activePlayerIds.has(stat.playerId),
  );

  const removedPlayerIds = currentPlayerStats
    .filter((stat) => !activePlayerIds.has(stat.playerId))
    .map((stat) => stat.playerId);

  return {
    updatedPlayerStats,
    removedPlayerIds,
  };
};
