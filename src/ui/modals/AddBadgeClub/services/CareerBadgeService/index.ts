import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { auth, db } from "../../../../../common/services/Firebase";
import { Teams } from "../../../../../pages/AddMatches/interface/teams";

type UpdateBadgeParams = {
  careerId: string;
  seasonId: string;
  teamName: string;
  imageUrl: string;
};

export const CareerBadgeService = {
  updateTeamBadge: async ({
    careerId,
    seasonId,
    teamName,
    imageUrl,
  }: UpdateBadgeParams): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const careerRef = doc(db, `users/${user.uid}/careers/${careerId}`);
    const snapshot = await getDoc(careerRef);

    if (!snapshot.exists()) {
      throw new Error("Carreira não encontrada");
    }

    const careerData = snapshot.data();
    let seasonFound = false;
    let teamFound = false;

    const updatedClubData = (careerData.clubData || []).map(
      (season: ClubData) => {
        if (String(season.id) === String(seasonId)) {
          seasonFound = true;

          const updatedTeams = (season.teams || []).map((team: Teams) => {
            if (
              team.name.trim().toLowerCase() === teamName.trim().toLowerCase()
            ) {
              teamFound = true;
              return { ...team, badge: imageUrl };
            }
            return team;
          });

          return { ...season, teams: updatedTeams };
        }
        return season;
      },
    );

    if (!seasonFound) {
      throw new Error("O ID não bateu com nenhuma temporada.");
    }
    if (seasonFound && !teamFound) {
      throw new Error("A temporada foi achada, mas o time não foi encontrado.");
    }

    await updateDoc(careerRef, {
      clubData: updatedClubData,
      updatedAt: Date.now(),
    });
  },
};
