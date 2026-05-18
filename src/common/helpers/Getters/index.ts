import { ServiceMatches } from "../../../pages/AddMatches/services/ServiceMatches";
import { ServicePlayers } from "../../services/ServicePlayers";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../../services/Firebase";
import { Career } from "../../interfaces/Career";
import { Match } from "../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { Players } from "../../interfaces/playersInfo/players";

export const getAllCareers = (
  uid: string,
  callback: (careers: Career[]) => void,
) => {
  const q = collection(db, `users/${uid}/careers`);

  return onSnapshot(q, async (querySnapshot) => {
    const careersData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
      } as Career;
    });

    const fullyLoadedCareers = await Promise.all(
      careersData.map(async (career) => {
        if (career.clubData && career.clubData.length > 0) {
          const updatedClubData = await Promise.all(
            career.clubData.map(async (season) => {
              try {
                const subcollectionMatches =
                  await ServiceMatches.getMatchesBySeason(career.id, season.id);
                const subcollectionPlayers =
                  await ServicePlayers.getPlayersBySeason(career.id, season.id);

                const oldMatches = season.matches || [];
                const subMatchesIds = new Set(
                  subcollectionMatches.map((m) => m.matchesId),
                );
                const combinedMatches = [
                  ...subcollectionMatches,
                  ...oldMatches.filter(
                    (m: Match) => !subMatchesIds.has(m.matchesId),
                  ),
                ];

                const oldPlayers = season.players || [];
                const subPlayersIds = new Set(
                  subcollectionPlayers.map((p) => p.id),
                );
                const combinedPlayers = [
                  ...subcollectionPlayers,
                  ...oldPlayers.filter(
                    (p: Players) => !subPlayersIds.has(p.id),
                  ),
                ];

                return {
                  ...season,
                  matches: combinedMatches,
                  players: combinedPlayers,
                };
              } catch (error) {
                console.error("Erro: ", error);
                return {
                  ...season,
                  matches: season.matches || [],
                  players: season.players || [],
                };
              }
            }),
          );
          return { ...career, clubData: updatedClubData };
        }
        return career;
      }),
    );

    callback(fullyLoadedCareers);
  });
};

export const getCareerById = async (
  uid: string,
  careerId: string,
): Promise<Career> => {
  const careerRef = doc(db, `users/${uid}/careers/${careerId}`);
  const careerSnap = await getDoc(careerRef);

  if (!careerSnap.exists()) throw new Error("Carreira não encontrada");

  const rawData = careerSnap.data();
  const careerData = {
    ...rawData,
    createdAt: rawData.createdAt?.toDate
      ? rawData.createdAt.toDate()
      : new Date(rawData.createdAt),
  } as Career;

  if (careerData.clubData && careerData.clubData.length > 0) {
    const updatedClubData = await Promise.all(
      careerData.clubData.map(async (season) => {
        try {
          const subcollectionMatches = await ServiceMatches.getMatchesBySeason(
            careerId,
            season.id,
          );
          const subcollectionPlayers = await ServicePlayers.getPlayersBySeason(
            careerId,
            season.id,
          );

          const oldMatches = season.matches || [];
          const subMatchesIds = new Set(
            subcollectionMatches.map((m) => m.matchesId),
          );
          const combinedMatches = [
            ...subcollectionMatches,
            ...oldMatches.filter((m: Match) => !subMatchesIds.has(m.matchesId)),
          ];

          const oldPlayers = season.players || [];
          const subPlayersIds = new Set(subcollectionPlayers.map((p) => p.id));
          const combinedPlayers = [
            ...subcollectionPlayers,
            ...oldPlayers.filter((p: Players) => !subPlayersIds.has(p.id)),
          ];

          return {
            ...season,
            matches: combinedMatches,
            players: combinedPlayers,
          };
        } catch (error) {
          console.error("Erro: ", error);
          return {
            ...season,
            matches: season.matches || [],
            players: season.players || [],
          };
        }
      }),
    );
    careerData.clubData = updatedClubData;
  }

  return careerData;
};
