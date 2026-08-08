import { User, onAuthStateChanged } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import { auth, db } from "../../../../../../../common/services/Firebase";

export const getAsyncUser = async (): Promise<User> => {
  const user = await new Promise<User | null>((resolve) => {
    if (auth.currentUser) return resolve(auth.currentUser);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      unsubscribe();
      resolve(currentUser);
    });
  });
  if (!user) throw new Error("Usuário não autenticado");
  return user;
};

export const requireUser = (): User => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");
  return user;
};

export const getAcademyCollection = (
  userId: string,
  careerId: string,
  seasonId: string,
  path: string,
) => {
  return collection(
    db,
    `users/${userId}/careers/${careerId}/seasons/${seasonId}/${path}`,
  );
};

export const getAcademyDoc = (
  userId: string,
  careerId: string,
  seasonId: string,
  path: string,
  docId: string,
) => {
  return doc(
    db,
    `users/${userId}/careers/${careerId}/seasons/${seasonId}/${path}`,
    docId,
  );
};
