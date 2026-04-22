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
    passes: Number(formValues.passes) || 0,
    finishings: Number(formValues.finishings) || 0,
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
