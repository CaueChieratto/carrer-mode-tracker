import { useMemo } from "react";
import { Career } from "../../../interfaces/Career";
import { Players } from "../../../interfaces/playersInfo/players";
import { LeagueStats } from "../../../interfaces/playersStats/leagueStats";

export const useAggregatedPlayers = (career: Career | undefined): Players[] => {
  const aggregatedPlayers = useMemo(() => {
    if (!career?.clubData) {
      return [];
    }

    const playerHistoryMap = new Map<string, Players[]>();

    career.clubData.forEach((season) => {
      season.players.forEach((player) => {
        const history = playerHistoryMap.get(player.name) || [];
        playerHistoryMap.set(player.name, [...history, player]);
      });
    });

    const finalPlayers: Players[] = [];

    playerHistoryMap.forEach((history) => {
      const latestPlayerState = { ...history[history.length - 1] };

      const maxOverall = Math.max(...history.map((p) => p.overall));
      latestPlayerState.overall = maxOverall;

      const leagueStatsMap = new Map<string, LeagueStats>();
      let totalBallonDor = 0;

      history.forEach((seasonPlayer) => {
        totalBallonDor += seasonPlayer.ballonDor || 0;
        seasonPlayer.statsLeagues.forEach((leagueStat) => {
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
        });
      });

      latestPlayerState.statsLeagues = Array.from(leagueStatsMap.values());
      latestPlayerState.ballonDor = totalBallonDor;
      finalPlayers.push(latestPlayerState);
    });

    return finalPlayers;
  }, [career]);

  return aggregatedPlayers;
};
