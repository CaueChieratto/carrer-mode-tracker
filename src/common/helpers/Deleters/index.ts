import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/Firebase";
import { Career } from "../../interfaces/Career";
import { Trophy } from "../../interfaces/club/trophy";

export const deleteCareerFromFirestore = async (
  userId: string,
  careerId: string
) => {
  const docRef = doc(db, `users/${userId}/careers/${careerId}`);
  await deleteDoc(docRef);
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
  seasonToRemove: string
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
