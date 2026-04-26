import { PlayerMatchStat } from "../../../../components/AllMatchesTab/types/PlayerMatchStat";

export const buildPlayerStats = (
  playerId: string,
  formValues: Record<string, string>,
  booleanValues: Record<string, boolean>,
): PlayerMatchStat => {
  const matchGoals = Number(formValues.matchGoals) || 0;
  const assists = Number(formValues.assists) || 0;

  const goalMinutes = Array.from({ length: matchGoals })
    .map((_, i) => Number(formValues[`goalMinute_${i}`]))
    .filter((val) => !isNaN(val) && val > 0);

  const assistTargets = Array.from({ length: assists })
    .map((_, i) => formValues[`assistToGoal_${i}`])
    .filter((val) => val && val !== "Nenhum gol disponível");

  const stats: PlayerMatchStat = {
    playerId,
    minutesPlayed: Number(formValues.minutesPlayed) || 0,
    goals: matchGoals,
    defenses: Number(formValues.cleanSheets) || 0,
    assists: assists,
    distanceKm: Number(formValues.distanceKm) || 0,
    totalPasses: Number(formValues.totalPasses) || 0,
    passPrecision: Number(formValues.passPrecision) || 0,
    passesMissed: Number(formValues.passesMissed) || 0,
    keyPasses: Number(formValues.keyPasses) || 0,
    totalFinishings: Number(formValues.totalFinishings) || 0,
    finishingPrecision: Number(formValues.finishingPrecision) || 0,
    finishingsMissed: Number(formValues.finishingsMissed) || 0,
    totalDribbles: Number(formValues.totalDribbles) || 0,
    dribblePrecision: Number(formValues.dribblePrecision) || 0,
    dribblesMissed: Number(formValues.dribblesMissed) || 0,
    ballsRecovered: Number(formValues.ballsRecovered) || 0,
    ballsLost: Number(formValues.ballsLost) || 0,
    rating: Number(formValues.rating) || 0,
    yellowCard: booleanValues.yellowCard || false,
    secondYellowCard: booleanValues.secondYellowCard || false,
    redCard: booleanValues.redCard || false,
    goalMinutes,
    assistTargets,
  };

  if (booleanValues.yellowCard && formValues.yellowCardMinute) {
    stats.yellowCardMinute = Number(formValues.yellowCardMinute);
  }

  if (booleanValues.secondYellowCard && formValues.secondYellowCardMinute) {
    stats.secondYellowCardMinute = Number(formValues.secondYellowCardMinute);
  }

  if (booleanValues.redCard && formValues.redCardMinute) {
    stats.redCardMinute = Number(formValues.redCardMinute);
  }

  if (formValues.substituteIn && formValues.substituteIn !== "Nenhum") {
    stats.substituteIn = formValues.substituteIn;
  }

  return stats as PlayerMatchStat;
};
