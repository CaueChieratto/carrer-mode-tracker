import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { Career } from "../../interfaces/Career";
import { db } from "../../services/Firebase";
import { mapDocToCareer } from "../Mappers";

export const getAllCareers = (
  userId: string,
  callback: (careers: Career[]) => void
) => {
  const careersRef = collection(db, `users/${userId}/careers`);
  return onSnapshot(careersRef, (snapshot) => {
    const careers = snapshot.docs.map(mapDocToCareer);
    callback(careers);
  });
};

export const getCareerById = async (
  userId: string,
  careerId: string
): Promise<Career> => {
  const careerRef = doc(db, `users/${userId}/careers/${careerId}`);
  const careerSnap = await getDoc(careerRef);
  if (!careerSnap.exists()) throw new Error("Carreira não encontrada");
  return careerSnap.data() as Career;
};
