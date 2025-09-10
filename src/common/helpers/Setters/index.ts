import { doc, updateDoc } from "firebase/firestore";
import { Career } from "../../interfaces/Career";
import { db } from "../../services/Firebase";
import { Trophy } from "../../interfaces/club/trophy";

export const updateCareerFirestore = async (
  userId: string,
  careerId: string,
  updates: Partial<Career>
) => {
  if (Object.keys(updates).length === 0) return;

  if (Object.keys(updates).length === 0) {
    throw new Error("Nenhuma atualização fornecida");
  }
  const careerRef = doc(db, `users/${userId}/careers/${careerId}`);
  await updateDoc(careerRef, updates);
};

export const updateCareerTrophies = async (
  userId: string,
  careerId: string,
  trophies: Trophy[]
) => {
  const careerRef = doc(db, `users/${userId}/careers/${careerId}`);
  await updateDoc(careerRef, { trophies });
};
