import {
  doc,
  deleteDoc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/Firebase";
import { Career } from "../../interfaces/Career";
import { Trophy } from "../../interfaces/club/trophy";

export const deleteCareerFromFirestore = async (
  userId: string,
  careerId: string,
): Promise<void> => {
  const careerRef = doc(db, `users/${userId}/careers/${careerId}`);
  const careerSnap = await getDoc(careerRef);

  if (!careerSnap.exists()) return;

  const careerData = careerSnap.data() as Career;

  if (careerData.clubData && careerData.clubData.length > 0) {
    for (const season of careerData.clubData) {
      const seasonId = season.id;

      const matchesRef = collection(
        db,
        `users/${userId}/careers/${careerId}/seasons/${seasonId}/matches`,
      );
      const matchesSnap = await getDocs(matchesRef);

      for (const matchDoc of matchesSnap.docs) {
        const matchId = matchDoc.id;

        const statsRef = collection(
          db,
          `users/${userId}/careers/${careerId}/seasons/${seasonId}/matches/${matchId}/playerStats`,
        );
        const statsSnap = await getDocs(statsRef);

        if (!statsSnap.empty) {
          const deleteStatsPromises = statsSnap.docs.map((statDoc) =>
            deleteDoc(statDoc.ref),
          );
          await Promise.all(deleteStatsPromises);
        }

        await deleteDoc(matchDoc.ref);
      }
    }
  }

  await deleteDoc(careerRef);
};

export const deleteCareerLocalStorage = (careerId: string) => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("colorSaved_") && key.endsWith(careerId)) {
      localStorage.removeItem(key);
    }
  });
};

export const deleteSeasonFromTrophies = (
  career: Career,
  leagueName: string,
  seasonToRemove: string,
): Trophy[] => {
  let trophies: Trophy[] = career.trophies || [];

  trophies = trophies.map((trophy) => {
    if (trophy.leagueName === leagueName) {
      return {
        ...trophy,
        seasons: trophy.seasons.filter((season) => season !== seasonToRemove),
      };
    }
    return trophy;
  });

  trophies = trophies.filter((trophy) => trophy.seasons.length > 0);

  return trophies;
};
