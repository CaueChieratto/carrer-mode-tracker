import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useGroupAggregatedPlayers } from "../../../../../../../common/hooks/Players/useGroupAggregatedPlayers";
import { Career } from "../../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import { Players } from "../../../../../../../common/interfaces/playersInfo/players";
import { useBestPlayersStats } from "../../../../ClubTabs/BestPlayersTab/hooks/useBestPlayersStats";
import { calculateTotalStats } from "../../../../ClubTabs/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";

type UsePlayerStatsProps = {
  season: ClubData;
  career: Career;
  player?: Players;
};

export const usePlayerStats = ({
  season,
  career,
  player,
}: UsePlayerStatsProps) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const statsData = useBestPlayersStats(season, career, isGeralPage, 0);

  const { groupPlayers, isLoadingGroup } = useGroupAggregatedPlayers(
    career,
    isGeralPage,
  );

  const playerStats = useMemo(() => {
    if (!player) return null;

    const normalizedName = player.name.trim().toLowerCase();
    const normalizedNation = player.nation.trim().toLowerCase();

    const basePlayerStats = statsData.find((d) => {
      if (isGeralPage) {
        return (
          d.player.name.trim().toLowerCase() === normalizedName &&
          d.player.nation.trim().toLowerCase() === normalizedNation
        );
      }
      return d.player.id === player.id;
    });

    if (isGeralPage && groupPlayers.length > 0) {
      const aggregatedPlayer = groupPlayers.find(
        (p) =>
          p.name.trim().toLowerCase() === normalizedName &&
          p.nation.trim().toLowerCase() === normalizedNation,
      );

      if (aggregatedPlayer) {
        const totalStats = calculateTotalStats(aggregatedPlayer);
        const minutes = totalStats.minutesPlayed || 0;
        const goals = totalStats.goals || 0;
        const assists = totalStats.assists || 0;
        const participations = goals + assists;

        return {
          ...(basePlayerStats || {}),
          ...aggregatedPlayer,
          ...totalStats,
          goalFrequency: goals > 0 ? minutes / goals : 0,
          assistFrequency: assists > 0 ? minutes / assists : 0,
          participationFrequency:
            participations > 0 ? minutes / participations : 0,
        };
      }
    }

    return basePlayerStats;
  }, [statsData, player, isGeralPage, groupPlayers]);

  return {
    playerStats,
    isLoadingGroup,
    isGeralPage,
  };
};
