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
  minPercentage: number = 0.2,
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

    const totalTeamMatches = seasonsToProcess.reduce((total, s) => {
      const finishedMatchesCount =
        s.matches?.filter((m) => m.status === "FINISHED").length || 0;
      return total + finishedMatchesCount;
    }, 0);

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
      const minutes = acc.minutesPlayed > 0 ? acc.minutesPlayed : 1;
      const multiplier90 = 90 / minutes;

      return {
        player: acc.player,
        games: acc.games,
        avgRating: acc.games > 0 ? acc.ratingSum / acc.games : 0,
        goals: acc.goals,
        assists: acc.assists,
        goalParticipations: acc.goals + acc.assists,
        goalFrequency: acc.goals > 0 ? acc.minutesPlayed / acc.goals : 0,
        assistFrequency: acc.assists > 0 ? acc.minutesPlayed / acc.assists : 0,
        participationFrequency:
          acc.goals + acc.assists > 0
            ? acc.minutesPlayed / (acc.goals + acc.assists)
            : 0,

        totalFinishings: acc.totalFinishings,
        finishingsPer90: acc.totalFinishings * multiplier90,
        finishingsOnTarget: acc.totalFinishings - acc.finishingsMissed,
        finishingsOnTargetPer90:
          (acc.totalFinishings - acc.finishingsMissed) * multiplier90,
        finishingsMissed: acc.finishingsMissed,
        finishingsMissedPer90: acc.finishingsMissed * multiplier90,

        totalPasses: acc.totalPasses,
        passesPer90: acc.totalPasses * multiplier90,
        passesCompleted: acc.totalPasses - acc.passesMissed,
        passesCompletedPer90:
          (acc.totalPasses - acc.passesMissed) * multiplier90,
        passesMissed: acc.passesMissed,
        passesMissedPer90: acc.passesMissed * multiplier90,

        keyPasses: acc.keyPasses,
        keyPassesPer90: acc.keyPasses * multiplier90,

        totalDribbles: acc.totalDribbles,
        dribblesPer90: acc.totalDribbles * multiplier90,
        dribblesCompleted: acc.totalDribbles - acc.dribblesMissed,
        dribblesCompletedPer90:
          (acc.totalDribbles - acc.dribblesMissed) * multiplier90,
        dribblesMissed: acc.dribblesMissed,
        dribblesMissedPer90: acc.dribblesMissed * multiplier90,

        ballsRecovered: acc.ballsRecovered,
        ballsRecoveredPer90: acc.ballsRecovered * multiplier90,

        ballsLost: acc.ballsLost,
        ballsLostPer90: acc.ballsLost * multiplier90,

        yellowCards: acc.yellowCards,
        yellowCardsPer90: acc.yellowCards * multiplier90,
        redCards: acc.redCards,
        redCardsPer90: acc.redCards * multiplier90,

        distanceKm: acc.distanceKm,
        distanceKmPer90: acc.distanceKm * multiplier90,
        maxDistanceKmInGame: acc.maxDistanceKmInGame,
        minutesPlayed: acc.minutesPlayed,
      } as AggregatedPlayerStats;
    });

    if (isGeralPage) {
      return aggregated;
    }

    const maxPlayerGames = aggregated.reduce(
      (max, stat) => Math.max(max, stat.games),
      0,
    );

    const referenceGames =
      totalTeamMatches > 0 ? totalTeamMatches : maxPlayerGames;

    const minGamesRequired = Math.ceil(referenceGames * minPercentage);

    return aggregated.filter((stat) => stat.games >= minGamesRequired);
  }, [season, career, isGeralPage, minPercentage]);
};
