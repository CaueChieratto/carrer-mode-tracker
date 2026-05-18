import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../common/services/Firebase";
import { updateCareerFirestore } from "../../../../common/helpers/Setters";
import { PlayerMatchStat } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/PlayerMatchStat";
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

    const matchRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/matches`,
      matchesId,
    );

    await setDoc(
      matchRef,
      {
        lineup,
        playerStats,
      },
      { merge: true },
    );

    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },
};
