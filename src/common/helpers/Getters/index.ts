import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { Career } from "../../interfaces/Career";
import { db } from "../../services/Firebase";
import { mapDocToCareer } from "../Mappers";
import { ClubData } from "../../interfaces/club/clubData";
import { Contract } from "../../interfaces/playersInfo/contract";
import { Players } from "../../interfaces/playersInfo/players";

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

  const data = careerSnap.data();

  if (data.clubData && Array.isArray(data.clubData)) {
    data.clubData.forEach((season: ClubData) => {
      if (season.players && Array.isArray(season.players)) {
        season.players.forEach((player: Players) => {
          if (player.contract && Array.isArray(player.contract)) {
            player.contract.forEach((contract: Contract) => {
              if (contract.dataArrival instanceof Timestamp) {
                contract.dataArrival = contract.dataArrival.toDate();
              }
              if (contract.dataExit instanceof Timestamp) {
                contract.dataExit = contract.dataExit.toDate();
              }
            });
          }
        });
      }
    });
  }

  return {
    id: careerSnap.id,
    ...data,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
  } as Career;
};
