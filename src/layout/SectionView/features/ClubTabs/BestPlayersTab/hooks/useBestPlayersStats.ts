import { useMemo } from "react";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Career } from "../../../../../../common/interfaces/Career";
import { AggregatedPlayerStats } from "../types/AggregatedPlayerStats";
import { PlayerStatsAccumulator } from "../types/PlayerStatsAccumulator";
import { getAggregatedPlayersForCareer } from "../../../../helpers/mergeMatchStats";

export const useBestPlayersStats = (
  season: ClubData,
  career: Career,
  isGeralPage: boolean,
): AggregatedPlayerStats[] => {
  return useMemo(() => {
    const playerStatsMap = new Map<string, PlayerStatsAccumulator>();

    const playersToProcess = isGeralPage
      ? getAggregatedPlayersForCareer(career)
      : season.players;

    playersToProcess.forEach((p) => {
      const normalizedName = p.name.trim().toLowerCase();
      const normalizedNation = p.nation.trim().toLowerCase();
      const key = isGeralPage ? `${normalizedName}-${normalizedNation}` : p.id;

      let baseGames = 0,
        baseRatingSum = 0,
        baseGoals = 0,
        baseAssists = 0,
        baseMinutes = 0;

      (p.statsLeagues || []).forEach((l) => {
        baseGames += l.stats.games || 0;
        baseRatingSum += (l.stats.rating || 0) * (l.stats.games || 0);
        baseGoals += l.stats.goals || 0;
        baseAssists += l.stats.assists || 0;
        baseMinutes += l.stats.minutesPlayed || 0;
      });

      if (!playerStatsMap.has(key)) {
        playerStatsMap.set(key, {
          player: p,
          games: baseGames,
          ratingSum: baseRatingSum,
          goals: baseGoals,
          assists: baseAssists,
          minutesPlayed: baseMinutes,
          totalFinishings: 0,
          finishingsMissed: 0,
          totalPasses: 0,
          passesMissed: 0,
          keyPasses: 0,
          totalDribbles: 0,
          dribblesMissed: 0,
          ballsRecovered: 0,
          ballsLost: 0,
          yellowCards: 0,
          redCards: 0,
          distanceKm: 0,
          maxDistanceKmInGame: 0,
        });
      }
    });

    const seasonsToProcess = isGeralPage ? career.clubData : [season];

    seasonsToProcess.forEach((s) => {
      s.matches?.forEach((match) => {
        if (match.status !== "FINISHED") return;

        match.playerStats?.forEach((pStat) => {
          const seasonPlayer = s.players.find((p) => p.id === pStat.playerId);
          if (!seasonPlayer) return;

          const normalizedName = seasonPlayer.name.trim().toLowerCase();
          const normalizedNation = seasonPlayer.nation.trim().toLowerCase();
          const key = isGeralPage
            ? `${normalizedName}-${normalizedNation}`
            : pStat.playerId;

          const acc = playerStatsMap.get(key);
          if (!acc) return;

          acc.totalFinishings += pStat.totalFinishings || 0;
          acc.finishingsMissed += pStat.finishingsMissed || 0;
          acc.totalPasses += pStat.totalPasses || 0;
          acc.passesMissed += pStat.passesMissed || 0;
          acc.keyPasses += pStat.keyPasses || 0;
          acc.totalDribbles += pStat.totalDribbles || 0;
          acc.dribblesMissed += pStat.dribblesMissed || 0;
          acc.ballsRecovered += pStat.ballsRecovered || 0;
          acc.ballsLost += pStat.ballsLost || 0;
          acc.yellowCards += pStat.yellowCard ? 1 : 0;
          acc.redCards += pStat.redCard ? 1 : 0;

          const matchDistance = pStat.distanceKm || 0;
          acc.distanceKm += matchDistance;

          if (matchDistance > acc.maxDistanceKmInGame) {
            acc.maxDistanceKmInGame = matchDistance;
          }
        });
      });
    });

    const aggregated = Array.from(playerStatsMap.values()).map((acc) => {
      const games = acc.games || 1;
      return {
        player: acc.player,
        games: acc.games,
        avgRating: acc.games > 0 ? acc.ratingSum / acc.games : 0,
        goals: acc.goals,
        assists: acc.assists,
        goalParticipations: acc.goals + acc.assists,
        goalFrequency: acc.goals > 0 ? acc.minutesPlayed / acc.goals : 0,
        totalFinishings: acc.totalFinishings,
        finishingsPerGame: acc.totalFinishings / games,
        finishingsOnTarget: acc.totalFinishings - acc.finishingsMissed,
        finishingsOnTargetPerGame:
          (acc.totalFinishings - acc.finishingsMissed) / games,
        finishingsMissed: acc.finishingsMissed,
        finishingsMissedPerGame: acc.finishingsMissed / games,
        totalPasses: acc.totalPasses,
        passesPerGame: acc.totalPasses / games,
        passesCompleted: acc.totalPasses - acc.passesMissed,
        passesCompletedPerGame: (acc.totalPasses - acc.passesMissed) / games,
        passesMissed: acc.passesMissed,
        passesMissedPerGame: acc.passesMissed / games,
        keyPasses: acc.keyPasses,
        keyPassesPerGame: acc.keyPasses / games,
        totalDribbles: acc.totalDribbles,
        dribblesPerGame: acc.totalDribbles / games,
        dribblesCompleted: acc.totalDribbles - acc.dribblesMissed,
        dribblesCompletedPerGame:
          (acc.totalDribbles - acc.dribblesMissed) / games,
        dribblesMissed: acc.dribblesMissed,
        dribblesMissedPerGame: acc.dribblesMissed / games,
        ballsRecovered: acc.ballsRecovered,
        ballsRecoveredPerGame: acc.ballsRecovered / games,
        ballsLost: acc.ballsLost,
        ballsLostPerGame: acc.ballsLost / games,
        yellowCards: acc.yellowCards,
        yellowCardsPerGame: acc.yellowCards / games,
        redCards: acc.redCards,
        redCardsPerGame: acc.redCards / games,
        distanceKm: acc.distanceKm,
        distanceKmPerGame: acc.distanceKm / games,
        maxDistanceKmInGame: acc.maxDistanceKmInGame,
        minutesPlayed: acc.minutesPlayed,
      } as AggregatedPlayerStats;
    });

    return aggregated.filter((stat) => stat.games >= 5);
  }, [season, career, isGeralPage]);
};
