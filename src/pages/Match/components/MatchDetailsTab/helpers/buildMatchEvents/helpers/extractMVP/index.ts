import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";

export const extractMVP = (match: Match, season: ClubData) => {
  if (match.opponentMvpName && match.opponentMvpRating) {
    return {
      mvpPlayerName: match.opponentMvpName,
      mvpRating: Number(match.opponentMvpRating),
    };
  }

  let mvpPlayerName = "Nenhum";
  let mvpRating = 0;

  if (!match.playerStats) {
    return { mvpPlayerName, mvpRating: null };
  }

  match.playerStats.forEach((stat) => {
    const player = season.players.find((p) => p.id === stat.playerId);
    if (!player) return;

    if (stat.rating > mvpRating) {
      mvpRating = stat.rating;
      mvpPlayerName = player.name;
    }
  });

  return {
    mvpPlayerName,
    mvpRating: mvpRating > 0 ? Number(mvpRating.toFixed(1)) : null,
  };
};
