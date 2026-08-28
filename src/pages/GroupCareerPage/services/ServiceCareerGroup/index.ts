import { doc, getDoc } from "firebase/firestore";
import { getCareerById } from "../../../../common/helpers/Getters";
import { CareerGroup } from "../../../../common/interfaces/CareerGroup";
import { auth, db } from "../../../../common/services/Firebase";

export const ServiceCareerGroup = {
  getById: async (groupId: string): Promise<CareerGroup | null> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const groupRef = doc(db, `users/${user.uid}/careerGroups/${groupId}`);
    const snap = await getDoc(groupRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    const careerIds: string[] = data.careerIds || [];

    const careers = await Promise.all(
      careerIds.map((id) => getCareerById(user.uid, id)),
    );

    return {
      id: groupId,
      managerName: data.managerName,
      careers,
      careerIds,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
      updatedAt: data.updatedAt,
    };
  },
};
