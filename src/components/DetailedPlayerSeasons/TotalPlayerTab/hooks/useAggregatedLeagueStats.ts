import { useMemo } from "react";
import { Career } from "../../../../common/interfaces/Career";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { LeagueStats } from "../../../../common/interfaces/playersStats/leagueStats";
import { LeagueLevels } from "../../../../common/constants/LeagueLevels";

export const useAggregatedLeagueStats = (career: Career, player?: Players) => {
  const seasonsPlayerPlayed = useMemo(() => {
    if (!player) return [];
    return career.clubData.filter((season) =>
      season.players.some((p) => p.id === player.id && !p.sell)
    );
  }, [career.clubData, player]);

  const aggregatedLeagueStats = useMemo((): LeagueStats[] => {
    const leagueStatsMap = new Map<string, LeagueStats>();

    for (const season of seasonsPlayerPlayed) {
      const playerInSeason = season.players.find((p) => p.id === player?.id);
      if (playerInSeason) {
        for (const leagueStat of playerInSeason.statsLeagues) {
          const existingLeague = leagueStatsMap.get(leagueStat.leagueName);
          if (existingLeague) {
            const oldTotalRating =
              existingLeague.stats.rating * existingLeague.stats.games;
            const newTotalRating =
              leagueStat.stats.rating * leagueStat.stats.games;
            const totalGames =
              existingLeague.stats.games + leagueStat.stats.games;

            existingLeague.stats.games += leagueStat.stats.games;
            existingLeague.stats.goals += leagueStat.stats.goals;
            existingLeague.stats.assists += leagueStat.stats.assists;
            existingLeague.stats.cleanSheets += leagueStat.stats.cleanSheets;
            existingLeague.stats.rating =
              totalGames > 0
                ? parseFloat(
                    ((oldTotalRating + newTotalRating) / totalGames).toFixed(2)
                  )
                : 0;
          } else {
            leagueStatsMap.set(
              leagueStat.leagueName,
              JSON.parse(JSON.stringify(leagueStat))
            );
          }
        }
      }
    }
    const aggregatedStats = Array.from(leagueStatsMap.values());
    return aggregatedStats.sort(
      (a, b) =>
        (LeagueLevels[a.leagueName] ?? 999) -
        (LeagueLevels[b.leagueName] ?? 999)
    );
  }, [seasonsPlayerPlayed, player]);

  return { aggregatedLeagueStats };
};
