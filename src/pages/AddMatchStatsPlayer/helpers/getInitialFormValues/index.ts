import { Match } from "../../../../components/AllMatchesTab/types/Match";

export const getInitialFormValues = (match: Match, playerId: string) => {
  const stats = match.playerStats?.find((s) => s.playerId === playerId);

  if (!stats) return null;

  const maxMatchMinutes = match.hasExtraTime
    ? 120 +
      (match.stoppage1T || 0) +
      (match.stoppage2T || 0) +
      (match.stoppageET1 || 0) +
      (match.stoppageET2 || 0)
    : 90 + (match.stoppage1T || 0) + (match.stoppage2T || 0);

  let initialMinutes = stats.minutesPlayed || 0;

  if (initialMinutes === 0) {
    const isStarter = [
      match.lineup?.goalkeeper?.playerId,
      ...(match.lineup?.lines?.flat().map((s) => s.playerId) || []),
    ].includes(playerId);

    if (isStarter && (!stats.substituteIn || stats.substituteIn === "Nenhum")) {
      initialMinutes = maxMatchMinutes;
    }
  }

  const formatValue = (value: number | undefined | null) =>
    value ? String(value) : "";

  const values: Record<string, string> = {
    minutesPlayed: initialMinutes ? String(initialMinutes) : "",
    rating: formatValue(stats.rating),
    matchGoals: formatValue(stats.goals),
    cleanSheets: formatValue(stats.defenses),
    assists: formatValue(stats.assists),
    totalPasses: formatValue(stats.totalPasses),
    passPrecision: formatValue(stats.passPrecision),
    passesMissed: formatValue(stats.passesMissed),
    keyPasses: formatValue(stats.keyPasses),
    totalFinishings: formatValue(stats.totalFinishings),
    finishingPrecision: formatValue(stats.finishingPrecision),
    finishingsMissed: formatValue(stats.finishingsMissed),
    totalDribbles: formatValue(stats.totalDribbles),
    dribblePrecision: formatValue(stats.dribblePrecision),
    dribblesMissed: formatValue(stats.dribblesMissed),
    ballsRecovered: formatValue(stats.ballsRecovered),
    ballsLost: formatValue(stats.ballsLost),
    distanceKm: formatValue(stats.distanceKm),
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
