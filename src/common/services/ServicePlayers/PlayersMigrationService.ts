import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { getCareerById } from "../../helpers/Getters";
import { updateCareerFirestore } from "../../helpers/Setters";
import { Career } from "../../interfaces/Career";
import { requireAuth } from "./helpers/authHelpers";

export const PlayersMigrationService = {
  migrateOldPlayersToSubcollections: async (): Promise<void> => {
    const user = requireAuth();
    const careersRef = collection(db, `users/${user.uid}/careers`);
    const snapshot = await getDocs(careersRef);

    for (const careerDoc of snapshot.docs) {
      const career = careerDoc.data() as Career;
      let careerChanged = false;
      if (!career.clubData) continue;

      const newClubData = [...career.clubData];
      for (let i = 0; i < newClubData.length; i++) {
        const season = newClubData[i];
        if (season.players && season.players.length > 0) {
          let successCount = 0;
          for (const player of season.players) {
            try {
              const playerRef = doc(
                db,
                `users/${user.uid}/careers/${career.id}/seasons/${season.id}/players`,
                player.id,
              );
              await setDoc(playerRef, player);
              successCount++;
            } catch (err) {
              console.error("Erro: ", err);
            }
          }
          if (successCount === season.players.length) {
            newClubData[i] = { ...season, players: [] };
            careerChanged = true;
          }
        }
      }
      if (careerChanged) {
        const careerRef = doc(db, `users/${user.uid}/careers/${career.id}`);
        await updateDoc(careerRef, { clubData: newClubData });
      }
    }
  },

  fixDuplicatePlayerIds: async (
    careerId: string,
  ): Promise<{ success: boolean; message: string }> => {
    const user = requireAuth();
    const career = await getCareerById(user.uid, careerId);
    const idMap = new Map<string, string>();
    let hasChanges = false;

    for (const season of career.clubData) {
      for (const player of season.players) {
        const uniqueKey = `${player.name.trim().toLowerCase()}-${player.nation.trim().toLowerCase()}`;
        if (idMap.has(uniqueKey)) {
          const correctId = idMap.get(uniqueKey)!;
          if (player.id !== correctId) {
            hasChanges = true;
            const oldRef = doc(
              db,
              `users/${user.uid}/careers/${careerId}/seasons/${season.id}/players`,
              player.id,
            );
            await deleteDoc(oldRef);

            const newRef = doc(
              db,
              `users/${user.uid}/careers/${careerId}/seasons/${season.id}/players`,
              correctId,
            );
            await setDoc(newRef, { ...player, id: correctId });
          }
        } else {
          idMap.set(uniqueKey, player.id);
        }
      }
    }

    if (hasChanges) {
      await updateCareerFirestore(user.uid, careerId, {
        updatedAt: Date.now(),
      });
      return { success: true, message: "Carreira corrigida! IDs unificados." };
    }

    return { success: false, message: "Nenhuma duplicação encontrada." };
  },
};
