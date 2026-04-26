import { Match } from "../../../../components/AllMatchesTab/types/Match";

export const getInitialFormValues = (match: Match, playerId: string) => {
  const stats = match.playerStats?.find((s) => s.playerId === playerId);

  if (!stats) return null;

  const values: Record<string, string> = {
    minutesPlayed: String(stats.minutesPlayed ?? 0),
    rating: String(stats.rating ?? 0),
    matchGoals: String(stats.goals ?? 0),
    cleanSheets: String(stats.defenses ?? 0),
    assists: String(stats.assists ?? 0),
    totalPasses: String(stats.totalPasses ?? 0),
    passPrecision: String(stats.passPrecision ?? 0),
    passesMissed: String(stats.passesMissed ?? 0),
    keyPasses: String(stats.keyPasses ?? 0),
    totalFinishings: String(stats.totalFinishings ?? 0),
    finishingPrecision: String(stats.finishingPrecision ?? 0),
    finishingsMissed: String(stats.finishingsMissed ?? 0),
    totalDribbles: String(stats.totalDribbles ?? 0),
    dribblePrecision: String(stats.dribblePrecision ?? 0),
    dribblesMissed: String(stats.dribblesMissed ?? 0),
    ballsRecovered: String(stats.ballsRecovered ?? 0),
    ballsLost: String(stats.ballsLost ?? 0),
    distanceKm: String(stats.distanceKm ?? 0),
    yellowCard: stats.yellowCard ? "true" : "false",
    yellowCardMinute: stats.yellowCardMinute
      ? String(stats.yellowCardMinute)
      : "",
    secondYellowCard: stats.secondYellowCard ? "true" : "false",
    secondYellowCardMinute: stats.secondYellowCardMinute
      ? String(stats.secondYellowCardMinute)
      : "",
    redCard: stats.redCard ? "true" : "false",
    redCardMinute: stats.redCardMinute ? String(stats.redCardMinute) : "",
    substituteIn: stats.substituteIn || "Nenhum",
  };

  if (stats.goalMinutes) {
    stats.goalMinutes.forEach((min: number, index: number) => {
      values[`goalMinute_${index}`] = String(min);
    });
  }

  if (stats.assistTargets) {
    stats.assistTargets.forEach((target: string, index: number) => {
      values[`assistToGoal_${index}`] = target;
    });
  }

  return {
    values,
    booleans: {
      yellowCard: stats.yellowCard,
      secondYellowCard: stats.secondYellowCard || false,
      redCard: stats.redCard,
    },
  };
};
