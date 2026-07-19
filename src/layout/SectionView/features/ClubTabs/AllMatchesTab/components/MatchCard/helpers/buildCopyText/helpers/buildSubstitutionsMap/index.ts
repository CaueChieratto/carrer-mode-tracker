import { Match } from "../../../../../../../../../../../common/interfaces/Match";

export type SubstitutionEntry = {
  playerName: string;
  rating: number;
  stat: NonNullable<Match["playerStats"]>[number];
};

export const buildSubstitutionsMap = (
  match: Match,
  getPlayerStat: (
    id?: string | null,
  ) => NonNullable<Match["playerStats"]>[number] | undefined,
): Map<string, SubstitutionEntry> => {
  const substitutions = new Map<string, SubstitutionEntry>();

  (match.lineup?.bench || []).forEach((benchPlayer) => {
    const stat = getPlayerStat(benchPlayer.playerId);

    if (!stat?.substituteIn) return;

    substitutions.set(stat.substituteIn, {
      playerName: benchPlayer.playerName || "Desc.",
      rating: stat.rating,
      stat,
    });
  });

  return substitutions;
};
