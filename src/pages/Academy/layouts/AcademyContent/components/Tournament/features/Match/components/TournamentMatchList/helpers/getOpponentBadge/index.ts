import { Career } from "../../../../../../../../../../../../common/interfaces/Career";

export const getOpponentBadge = (
  career: Career,
  opponentName: string,
): string | null => {
  for (const season of career.clubData) {
    if (season.teams) {
      const team = season.teams.find((t) => t.name === opponentName);
      if (team?.badge) {
        return team.badge;
      }
    }
  }
  return null;
};
