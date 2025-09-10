import { collection, doc, setDoc } from "firebase/firestore";
import { Career } from "../../interfaces/Career";
import { auth, db } from "../Firebase";
import { Trophy } from "../../interfaces/club/trophy";
import {
  deleteCareerFromFirestore,
  deleteCareerLocalStorage,
  deleteSeasonFromTrophies,
} from "../../helpers/Deleters";
import { getAllCareers, getCareerById } from "../../helpers/Getters";
import { buildCareerUpdates } from "../../helpers/Builders";
import {
  updateCareerFirestore,
  updateCareerTrophies,
} from "../../helpers/Setters";
import { mergeTrophies } from "../../helpers/Mergers";

export const ServiceCareer = {
  getAll: (callback: (careers: Career[]) => void) => {
    const user = auth.currentUser;
    if (!user) {
      callback([]);
      return;
    }

    return getAllCareers(user.uid, callback);
  },

  saveCareer: async (career: Career): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const response = collection(db, `users/${user.uid}/careers`);
    const careerDoc = doc(response, career.id);
    await setDoc(careerDoc, career);
  },

  deleteCareer: async (careerId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");

    await deleteCareerFromFirestore(user.uid, careerId);
    deleteCareerLocalStorage(careerId);
  },

  editCareer: async (
    careerId: string,
    colorsTeams?: string[],
    fileDataUrl?: string,
    clubName?: string,
    managerName?: string
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const updates = buildCareerUpdates({
      colorsTeams,
      fileDataUrl,
      clubName,
      managerName,
    });

    try {
      await updateCareerFirestore(user.uid, careerId, updates);
    } catch (error) {
      console.error("Erro ao atualizar carreira:", error);
      throw error;
    }
  },

  saveClubTrophie: async (
    careerId: string,
    leagueName: string,
    seasons: string[]
  ): Promise<Trophy[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);
    const updatedTrophies = mergeTrophies(career, leagueName, seasons);
    await updateCareerTrophies(user.uid, careerId, updatedTrophies);

    return updatedTrophies;
  },

  removeSeason: async (
    careerId: string,
    leagueName: string,
    seasonToRemove: string
  ): Promise<Trophy[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);
    const updatedTrophies = deleteSeasonFromTrophies(
      career,
      leagueName,
      seasonToRemove
    );

    await updateCareerTrophies(user.uid, careerId, updatedTrophies);

    return updatedTrophies;
  },
};
