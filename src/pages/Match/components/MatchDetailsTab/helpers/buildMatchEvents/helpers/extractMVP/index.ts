import { ClubData } from "../../../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";

export const extractMVP = (match: Match, season: ClubData) => {
  if (match.opponentMvpName && match.opponentMvpRating) {
    return {
      mvpPlayerName: match.opponentMvpName,
      mvpRating: Number(match.opponentMvpRating),
      isUserPlayer: false,
      shirtNumber: null,
    };
  }

  let mvpPlayerName = "Nenhum";
  let mvpRating = 0;
  let shirtNumber: string | null = null;

  if (!match.playerStats) {
    return {
      mvpPlayerName,
      mvpRating: null,
      isUserPlayer: false,
      shirtNumber,
    };
  }

  match.playerStats.forEach((stat) => {
    const player = season.players.find((p) => p.id === stat.playerId);

    if (!player) return;

    if (stat.rating > mvpRating) {
      mvpRating = stat.rating;
      mvpPlayerName = player.name;
      shirtNumber = player.shirtNumber;
    }
  });

  return {
    mvpPlayerName,
    mvpRating: mvpRating > 0 ? Number(mvpRating.toFixed(1)) : null,
    isUserPlayer: true,
    shirtNumber,
  };
};
