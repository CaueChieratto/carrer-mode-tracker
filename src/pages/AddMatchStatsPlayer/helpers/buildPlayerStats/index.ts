import { PlayerMatchStat } from "../../../../components/AllMatchesTab/types/PlayerMatchStat";

export const buildPlayerStats = (
  playerId: string,
  formValues: Record<string, string>,
  booleanValues: Record<string, boolean>,
): PlayerMatchStat => {
  const stats: PlayerMatchStat = {
    playerId,
    minutesPlayed: Number(formValues.minutesPlayed) || 0,
    goals: Number(formValues.matchGoals) || 0,
    defenses: Number(formValues.cleanSheets) || 0,
    assists: Number(formValues.assists) || 0,
    distanceKm: Number(formValues.distanceKm) || 0,
    passes: Number(formValues.passes) || 0,
    finishings: Number(formValues.finishings) || 0,
    rating: Number(formValues.rating) || 0,
    yellowCard: booleanValues.yellowCard || false,
    redCard: booleanValues.redCard || false,
  };

  if (formValues.substituteIn && formValues.substituteIn !== "Nenhum") {
    stats.substituteIn = formValues.substituteIn;
  }

  return stats;
};
