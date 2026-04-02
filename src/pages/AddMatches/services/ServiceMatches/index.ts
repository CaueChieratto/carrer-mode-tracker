import { getCareerById } from "../../../../common/helpers/Getters";
import { updateCareerFirestore } from "../../../../common/helpers/Setters";
import { auth } from "../../../../common/services/Firebase";
import { Match } from "../../../../components/AllMatchesTab/types/Match";

export const ServiceMatches = {
  addMatchToSeason: async (
    careerId: string,
    seasonId: string,
    match: Match,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const existingMatches = season.matches || [];
        return {
          ...season,
          matches: [...existingMatches, match],
        };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  updateMatchInSeason: async (
    careerId: string,
    seasonId: string,
    updatedMatch: Match,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const existingMatches = season.matches || [];
        return {
          ...season,
          matches: existingMatches.map((m) =>
            m.matchesId === updatedMatch.matchesId ? updatedMatch : m,
          ),
        };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  deleteMatchFromSeason: async (
    careerId: string,
    seasonId: string,
    matchId: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        return {
          ...season,
          matches: season.matches?.filter((m) => m.matchesId !== matchId) || [],
        };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },
};
