import { Career } from "../../../../../../../../../../../../common/interfaces/Career";

export const getOpponentBadge = (
  allCareers: Career[],
  opponentName: string,
): string | null => {
  if (!opponentName) return null;

  const normalizedOpponent = opponentName.trim().toLowerCase();

  for (const career of allCareers) {
    for (const season of career.clubData) {
      if (season.teams) {
        const team = season.teams.find(
          (t) => t.name.trim().toLowerCase() === normalizedOpponent,
        );
        if (team?.badge) {
          return team.badge;
        }
      }
    }
  }
  return null;
};
