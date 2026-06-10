import { getCareerById } from "../../helpers/Getters";
import { updateCareerFirestore } from "../../helpers/Setters";
import { ClubData } from "../../interfaces/club/clubData";
import { League } from "../../utils/Leagues";
import { auth, db } from "../Firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { stripHeavyData } from "../../utils/stripHeavyData";
import { getSeasonDateRange } from "../../utils/GetSeasonDateRange";

export const ServiceSeasons = {
  addSeason: async (careerId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);
    const existingNumbers = career.clubData.map((s) => s.seasonNumber);

    let seasonNumber = 1;
    while (existingNumbers.includes(seasonNumber)) {
      seasonNumber++;
    }

    const { startDate } = getSeasonDateRange(
      seasonNumber,
      career.createdAt,
      career.nation,
    );

    const returnDate = startDate;

    const previousSeason = career.clubData.find(
      (season) => season.seasonNumber === seasonNumber - 1,
    );
    const playersFromPreviousSeason = previousSeason
      ? previousSeason.players
      : [];
    const leaguesFromPreviousSeason = previousSeason?.leagues || [];

    const playersForNewSeason = playersFromPreviousSeason
      .filter((player) => !player.sell)
      .map((player) => {
        const lastContract = player.contract?.[player.contract.length - 1];

        const shouldReturnLoan =
          player.loan &&
          !player.incomingLoan &&
          (lastContract?.loanDuration ?? 0) <= 1;

        const updatedPlayer = {
          ...player,
          age: (player.age || 0) + 1,
          contractTime: Math.max(0, (player.contractTime || 0) - 1),
          statsLeagues: [],
          ballonDor: 0,
          buy: false,
        };

        if (shouldReturnLoan) {
          updatedPlayer.loan = false;

          const lastContract = player.contract[player.contract.length - 1];

          updatedPlayer.contract.push({
            buyValue: 0,
            sellValue: 0,
            fromClub: lastContract.leftClub || "Fim de Empréstimo",
            leftClub: "",
            dataArrival: returnDate,
            dataExit: null,
          });

          updatedPlayer.contract.push({
            buyValue: 0,
            sellValue: 0,
            fromClub: "",
            leftClub: "",
            dataArrival: null,
            dataExit: null,
          });
        } else if (
          player.loan &&
          !player.incomingLoan &&
          (lastContract?.loanDuration ?? 0) > 1
        ) {
          updatedPlayer.contract = player.contract.map((contract, index) =>
            index === player.contract.length - 1
              ? { ...contract, loanDuration: (contract.loanDuration || 0) - 1 }
              : contract,
          );
        }

        return updatedPlayer;
      });

    const newSeasonId = uuidv4();
    const newSeason: ClubData = {
      players: [],
      seasonNumber,
      id: newSeasonId,
      leagues: leaguesFromPreviousSeason,
    };

    const updatedClubData = [...career.clubData, newSeason];

    try {
      await updateCareerFirestore(user.uid, careerId, {
        clubData: stripHeavyData(updatedClubData),
      });

      for (const player of playersForNewSeason) {
        const playerRef = doc(
          db,
          `users/${user.uid}/careers/${careerId}/seasons/${newSeasonId}/players`,
          player.id,
        );
        await setDoc(playerRef, player);
      }
    } catch (error) {
      console.error(
        `[addSeason] ERRO ao tentar criar e salvar a temporada:`,
        error,
      );
      throw error;
    }
  },

  deleteSeason: async (careerId: string, seasonId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.filter(
      (season) => season.id !== seasonId,
    );

    const seasonPath = `users/${user.uid}/careers/${careerId}/seasons/${seasonId}`;

    const playersSnapshot = await getDocs(
      collection(db, `${seasonPath}/players`),
    );

    for (const playerDoc of playersSnapshot.docs) {
      await deleteDoc(playerDoc.ref);
    }

    await deleteDoc(doc(db, seasonPath));

    await updateCareerFirestore(user.uid, careerId, {
      clubData: stripHeavyData(updatedClubData),
    });
  },

  updateSeasonLeagues: async (
    careerId: string,
    seasonId: string,
    leagues: League[],
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);
    const updatedClubData = career.clubData.map((season) =>
      season.id === seasonId ? { ...season, leagues } : season,
    );

    await updateCareerFirestore(user.uid, careerId, {
      clubData: stripHeavyData(updatedClubData),
    });
  },
};
