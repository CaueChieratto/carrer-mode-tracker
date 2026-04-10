import { Match } from "../../../../components/AllMatchesTab/types/Match";

export const getInitialFormValues = (match: Match, playerId: string) => {
  const stats = match.playerStats?.find((s) => s.playerId === playerId);

  if (!stats) return null;

  return {
    values: {
      minutesPlayed: String(stats.minutesPlayed ?? 0),
      rating: String(stats.rating ?? 0),
      matchGoals: String(stats.goals ?? 0),
      cleanSheets: String(stats.defenses ?? 0),
      assists: String(stats.assists ?? 0),
      passes: String(stats.passes ?? 0),
      finishings: String(stats.finishings ?? 0),
      distanceKm: String(stats.distanceKm ?? 0),
      yellowCard: stats.yellowCard ? "true" : "false",
      redCard: stats.redCard ? "true" : "false",
      substituteIn: stats.substituteIn || "Nenhum",
    },
    booleans: {
      yellowCard: stats.yellowCard,
      redCard: stats.redCard,
    },
  };
};
