import { useMemo } from "react";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { calculateTotalStats } from "../../../ClubTabs/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";

export const useRenderableSeasons = (
  seasonsPlayerPlayed: ClubData[],
  player?: Players,
): ClubData[] => {
  const renderableSeasons = useMemo(() => {
    if (!player) return [];

    const normalizedName = player.name.trim().toLowerCase();
    const normalizedNation = player.nation.trim().toLowerCase();

    return seasonsPlayerPlayed.filter((season) => {
      const playerInSeason = season.players.find(
        (p) =>
          p.name.trim().toLowerCase() === normalizedName &&
          p.nation.trim().toLowerCase() === normalizedNation,
      );

      if (!playerInSeason) {
        return false;
      }

      const totalStats = calculateTotalStats(playerInSeason);
      return (
        totalStats.games > 0 ||
        totalStats.goals > 0 ||
        totalStats.assists > 0 ||
        totalStats.cleanSheets > 0 ||
        totalStats.minutesPlayed > 0 ||
        totalStats.defenses > 0
      );
    });
  }, [seasonsPlayerPlayed, player]);

  return renderableSeasons;
};
