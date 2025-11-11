import { useMemo } from "react";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { calculateTotalStats } from "../../../../common/utils/PlayerStatsCalculator";

export const useRenderableSeasons = (
  seasonsPlayerPlayed: ClubData[],
  playerId?: string
): ClubData[] => {
  const renderableSeasons = useMemo(() => {
    return seasonsPlayerPlayed.filter((season) => {
      const playerInSeason = season.players.find((p) => p.id === playerId);
      if (!playerInSeason) {
        return false;
      }
      const totalStats = calculateTotalStats(playerInSeason);
      return (
        totalStats.games > 0 ||
        totalStats.goals > 0 ||
        totalStats.assists > 0 ||
        totalStats.cleanSheets > 0
      );
    });
  }, [seasonsPlayerPlayed, playerId]);

  return renderableSeasons;
};
