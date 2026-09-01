import type { Match } from "../../../../../../common/interfaces/Match";

export const getMvpPlayerId = (
  playerStats: Match["playerStats"],
): string | null => {
  if (!playerStats || playerStats.length === 0) {
    return null;
  }

  let highestRating = 0;
  let mvpPlayerId: string | null = null;

  playerStats.forEach((stat) => {
    if (stat.rating > highestRating) {
      highestRating = stat.rating;
      mvpPlayerId = stat.playerId;
    }
  });

  return highestRating > 0 ? mvpPlayerId : null;
};
