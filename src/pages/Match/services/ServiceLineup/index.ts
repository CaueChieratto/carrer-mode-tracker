import { getCareerById } from "../../../../common/helpers/Getters";
import { updateCareerFirestore } from "../../../../common/helpers/Setters";
import { auth } from "../../../../common/services/Firebase";
import { PlayerMatchStat } from "../../../../components/AllMatchesTab/types/PlayerMatchStat";
import { SavedLineup } from "../../types/Lineup";

export const ServiceLineup = {
  saveLineupToMatch: async (
    careerId: string,
    seasonId: string,
    matchesId: string,
    lineup: SavedLineup,
    playerStats: PlayerMatchStat[],
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id !== seasonId) return season;

      return {
        ...season,
        matches: season.matches?.map((match) =>
          match.matchesId === matchesId
            ? { ...match, lineup, playerStats }
            : match,
        ),
      };
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },
};
