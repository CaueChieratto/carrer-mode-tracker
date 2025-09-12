import { useMemo } from "react";
import { Career } from "../../../interfaces/Career";
import { Players } from "../../../interfaces/playersInfo/players";

export const useAggregatedPlayers = (career: Career): Players[] => {
  const aggregatedPlayers = useMemo(() => {
    const playerStatsMap = new Map<string, Players>();

    career.clubData.forEach((season) => {
      season.players.forEach((player) => {
        const existingPlayer = playerStatsMap.get(player.id);

        if (existingPlayer) {
          player.statsLeagues.forEach((newLeagueStat) => {
            const existingLeague = existingPlayer.statsLeagues.find(
              (l) => l.leagueName === newLeagueStat.leagueName
            );
            if (existingLeague) {
              const oldTotalRating =
                existingLeague.stats.rating * existingLeague.stats.games;
              const newTotalRating =
                newLeagueStat.stats.rating * newLeagueStat.stats.games;
              const totalGames =
                existingLeague.stats.games + newLeagueStat.stats.games;

              existingLeague.stats.games += newLeagueStat.stats.games;
              existingLeague.stats.goals += newLeagueStat.stats.goals;
              existingLeague.stats.assists += newLeagueStat.stats.assists;
              existingLeague.stats.cleanSheets +=
                newLeagueStat.stats.cleanSheets;
              existingLeague.stats.rating =
                totalGames > 0
                  ? parseFloat(
                      ((oldTotalRating + newTotalRating) / totalGames).toFixed(
                        2
                      )
                    )
                  : 0;
            } else {
              existingPlayer.statsLeagues.push({ ...newLeagueStat });
            }
          });

          existingPlayer.age = player.age;
          existingPlayer.overall = player.overall;
          existingPlayer.playerValue = player.playerValue;
          existingPlayer.contractTime = player.contractTime;
          existingPlayer.salary = player.salary;
          existingPlayer.ballonDor += player.ballonDor;
        } else {
          const newPlayer = JSON.parse(JSON.stringify(player));
          playerStatsMap.set(player.id, newPlayer);
        }
      });
    });

    return Array.from(playerStatsMap.values());
  }, [career]);

  return aggregatedPlayers;
};
