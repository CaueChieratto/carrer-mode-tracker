import { Players } from "../../../../common/interfaces/playersInfo/players";
import { formatDisplayValue } from "../../../../common/utils/FormatValue";
import { Match } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { calculateTotalStats } from "../../../../layout/SectionView/features/ClubTabs/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";
import { PlayerStatsDisplay, AugmentedCareer } from "../../types";

export const getAggregatedStats = (
  player: Players | null,
  augmentedCareer: AugmentedCareer | null,
  seasonId: string | undefined,
  compareMode: "season" | "total" | "none",
): PlayerStatsDisplay | null => {
  if (!player || !augmentedCareer || compareMode === "none") return null;

  const normalizedName = player.name.trim().toLowerCase();
  const normalizedNation = player.nation.trim().toLowerCase();

  const matchesToProcess: { match: Match; seasonPlayers: Players[] }[] = [];
  let seasonsAtClub = 0;

  if (compareMode === "total") {
    augmentedCareer.clubData.forEach((s) => {
      s.matches?.forEach((m) =>
        matchesToProcess.push({ match: m, seasonPlayers: s.players }),
      );

      const playedInSeason = s.players.some(
        (p) =>
          p.name.trim().toLowerCase() === normalizedName &&
          p.nation.trim().toLowerCase() === normalizedNation,
      );
      if (playedInSeason) seasonsAtClub++;
    });
  } else {
    const season = augmentedCareer.clubData.find(
      (s) => String(s.id) === String(seasonId),
    );
    if (season) {
      season.matches?.forEach((m) =>
        matchesToProcess.push({ match: m, seasonPlayers: season.players }),
      );
    }
  }

  let distanceKm = 0;
  let maxDistanceKmInGame = 0;
  let yellowCards = 0;
  let redCards = 0;
  let totalPasses = 0;
  let passesMissed = 0;
  let totalFinishings = 0;
  let finishingsMissed = 0;
  let totalDribbles = 0;
  let dribblesMissed = 0;
  let keyPasses = 0;
  let ballsRecovered = 0;
  let ballsLost = 0;
  let ownGoals = 0;

  matchesToProcess.forEach(({ match, seasonPlayers }) => {
    if (match.status !== "FINISHED") return;

    match.playerStats?.forEach((pStat) => {
      const sPlayer = seasonPlayers.find(
        (p) => String(p.id) === String(pStat.playerId),
      );
      if (!sPlayer) return;

      const isSamePlayer =
        compareMode === "total"
          ? sPlayer.name.trim().toLowerCase() === normalizedName &&
            sPlayer.nation.trim().toLowerCase() === normalizedNation
          : String(sPlayer.id) === String(player.id);

      if (isSamePlayer) {
        const matchDistance = pStat.distanceKm || 0;
        distanceKm += matchDistance;

        if (matchDistance > maxDistanceKmInGame) {
          maxDistanceKmInGame = matchDistance;
        }

        if (pStat.yellowCard) yellowCards += 1;
        if (pStat.redCard) redCards += 1;
        totalPasses += pStat.totalPasses || 0;
        passesMissed += pStat.passesMissed || 0;
        totalFinishings += pStat.totalFinishings || 0;
        finishingsMissed += pStat.finishingsMissed || 0;
        totalDribbles += pStat.totalDribbles || 0;
        dribblesMissed += pStat.dribblesMissed || 0;
        keyPasses += pStat.keyPasses || 0;
        ballsRecovered += pStat.ballsRecovered || 0;
        ballsLost += pStat.ballsLost || 0;
        ownGoals += pStat.ownGoals || 0;
      }
    });
  });

  const coreStats = calculateTotalStats(player);
  const minutes = coreStats.minutesPlayed > 0 ? coreStats.minutesPlayed : 1;
  const multiplier90 = 90 / minutes;

  const goals = coreStats.goals;
  const assists = coreStats.assists;
  const goalParticipations = goals + assists;

  return {
    age: `${player.age} anos`,
    position: player.position,
    marketValue: formatDisplayValue(player.playerValue),
    salary: formatDisplayValue(player.salary),
    seasonsAtClub: compareMode === "total" ? seasonsAtClub : undefined,

    games: coreStats.games,
    rating:
      coreStats.averageRating > 0 ? coreStats.averageRating.toFixed(2) : "-",
    goalParticipations,
    goals,
    assists,
    defenses: coreStats.defenses,

    goalFrequency:
      goals > 0 ? `${Math.round(coreStats.minutesPlayed / goals)}'` : "-",
    assistFrequency:
      assists > 0 ? `${Math.round(coreStats.minutesPlayed / assists)}'` : "-",
    participationFrequency:
      goalParticipations > 0
        ? `${Math.round(coreStats.minutesPlayed / goalParticipations)}'`
        : "-",
    totalFinishings,
    finishingsPer90: (totalFinishings * multiplier90).toFixed(1),
    finishingsOnTarget: totalFinishings - finishingsMissed,
    finishingsOnTargetPer90: (
      (totalFinishings - finishingsMissed) *
      multiplier90
    ).toFixed(1),
    finishingsMissed,
    finishingsMissedPer90: (finishingsMissed * multiplier90).toFixed(1),

    totalPasses,
    passesPer90: (totalPasses * multiplier90).toFixed(1),
    passesCompleted: totalPasses - passesMissed,
    passesCompletedPer90: ((totalPasses - passesMissed) * multiplier90).toFixed(
      1,
    ),
    passesMissed,
    passesMissedPer90: (passesMissed * multiplier90).toFixed(1),
    keyPasses,
    keyPassesPer90: (keyPasses * multiplier90).toFixed(1),
    totalDribbles,
    dribblesPer90: (totalDribbles * multiplier90).toFixed(1),
    dribblesCompleted: totalDribbles - dribblesMissed,
    dribblesCompletedPer90: (
      (totalDribbles - dribblesMissed) *
      multiplier90
    ).toFixed(1),
    dribblesMissed,
    dribblesMissedPer90: (dribblesMissed * multiplier90).toFixed(1),

    cleanSheets: coreStats.cleanSheets,
    ballsRecovered,
    ballsRecoveredPer90: (ballsRecovered * multiplier90).toFixed(1),
    ballsLost,
    ballsLostPer90: (ballsLost * multiplier90).toFixed(1),

    minutesPlayed: coreStats.minutesPlayed,
    minutesPerGame:
      coreStats.games > 0
        ? `${Math.round(coreStats.minutesPlayed / coreStats.games)}'`
        : "-",
    maxDistanceKmInGame: `${maxDistanceKmInGame.toFixed(1)}km`,
    distanceKmPer90: `${(distanceKm * multiplier90).toFixed(1)}km`,
    distanceKm: `${distanceKm.toFixed(1)}km`,
    yellowCards,
    yellowCardsPer90: (yellowCards * multiplier90).toFixed(1),
    redCards,
    redCardsPer90: (redCards * multiplier90).toFixed(1),
    ownGoals,
  };
};
