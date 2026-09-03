import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { updateCareerFirestore } from "../../../../../../../../../common/helpers/Setters";
import { auth, db } from "../../../../../../../../../common/services/Firebase";
import { TableTeamData } from "../../../../../../../../../common/interfaces/TableTeamData";

export const ServiceTable = {
  getTableBySeason: async (
    careerId: string,
    seasonId: string,
  ): Promise<TableTeamData[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const tableRef = collection(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/table`,
    );

    const snapshot = await getDocs(tableRef);
    return snapshot.docs.map((doc) => doc.data() as TableTeamData);
  },

  addTeamToTable: async (
    careerId: string,
    seasonId: string,
    teamData: TableTeamData,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const teamRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/table`,
      teamData.id,
    );

    await setDoc(teamRef, teamData);
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  updateTeamInTable: async (
    careerId: string,
    seasonId: string,
    teamId: string,
    updatedData: Partial<TableTeamData>,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const teamRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/table`,
      teamId,
    );

    await setDoc(teamRef, updatedData, { merge: true });
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  deleteTeamFromTable: async (
    careerId: string,
    seasonId: string,
    teamId: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const teamRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/table`,
      teamId,
    );

    await deleteDoc(teamRef);
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },
};
