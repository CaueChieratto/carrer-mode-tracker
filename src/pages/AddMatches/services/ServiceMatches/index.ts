import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../../common/services/Firebase";
import { Match } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { updateCareerFirestore } from "../../../../common/helpers/Setters";
import { Career } from "../../../../common/interfaces/Career";
import { Teams } from "../../interface/teams";

export const ServiceMatches = {
  addMatchToSeason: async (
    careerId: string,
    seasonId: string,
    match: Match,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const matchRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/matches`,
      match.matchesId,
    );

    await setDoc(matchRef, match);

    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  addTeamToSeason: async (
    careerId: string,
    seasonId: string,
    team: Teams,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const careerRef = doc(db, `users/${user.uid}/careers/${careerId}`);
    const careerSnap = await getDoc(careerRef);
    if (!careerSnap.exists()) return;

    const careerData = careerSnap.data() as Career;
    const updatedClubData = careerData.clubData?.map((season) => {
      if (season.id === seasonId) {
        return { ...season, teams: [...(season.teams || []), team] };
      }
      return season;
    });

    await updateDoc(careerRef, {
      clubData: updatedClubData,
      updatedAt: Date.now(),
    });
  },

  updateSeasonTeams: async (
    careerId: string,
    seasonId: string,
    teams: Teams[],
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const careerRef = doc(db, `users/${user.uid}/careers/${careerId}`);
    const careerSnap = await getDoc(careerRef);
    if (!careerSnap.exists()) return;

    const careerData = careerSnap.data() as Career;
    const updatedClubData = careerData.clubData?.map((season) => {
      if (season.id === seasonId) {
        return { ...season, teams: teams };
      }
      return season;
    });

    await updateDoc(careerRef, {
      clubData: updatedClubData,
      updatedAt: Date.now(),
    });
  },

  removeTeamFromSeason: async (
    careerId: string,
    seasonId: string,
    team: Teams,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const careerRef = doc(db, `users/${user.uid}/careers/${careerId}`);
    const careerSnap = await getDoc(careerRef);
    if (!careerSnap.exists()) return;

    const careerData = careerSnap.data() as Career;
    const updatedClubData = careerData.clubData?.map((season) => {
      if (season.id === seasonId) {
        return {
          ...season,
          teams: (season.teams || []).filter((t) => t.name !== team.name),
        };
      }
      return season;
    });

    await updateDoc(careerRef, {
      clubData: updatedClubData,
      updatedAt: Date.now(),
    });
  },

  updateMatchInSeason: async (
    careerId: string,
    seasonId: string,
    updatedMatch: Match,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const matchRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/matches`,
      updatedMatch.matchesId,
    );

    await setDoc(matchRef, updatedMatch, { merge: true });

    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  deleteMatchFromSeason: async (
    careerId: string,
    seasonId: string,
    matchId: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const matchRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/matches`,
      matchId,
    );

    await deleteDoc(matchRef);

    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  getMatchesBySeason: async (
    careerId: string,
    seasonId: string,
  ): Promise<Match[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const matchesCollectionRef = collection(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/matches`,
    );
    const snapshot = await getDocs(matchesCollectionRef);

    return snapshot.docs.map((doc) => doc.data() as Match);
  },

  migrateOldMatchesToSubcollections: async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    console.log("🔍 Iniciando verificação de partidas antigas...");

    const careersRef = collection(db, `users/${user.uid}/careers`);
    const snapshot = await getDocs(careersRef);

    for (const careerDoc of snapshot.docs) {
      const career = careerDoc.data() as Career;
      let careerChanged = false;

      if (!career.clubData) continue;

      const newClubData = [...career.clubData];

      for (let i = 0; i < newClubData.length; i++) {
        const season = newClubData[i];

        if (season.matches && season.matches.length > 0) {
          console.log(
            `⏳ Copiando ${season.matches.length} partidas da temporada ${season.id} (${career.clubName})...`,
          );

          let successCount = 0;

          for (const match of season.matches) {
            try {
              const matchRef = doc(
                db,
                `users/${user.uid}/careers/${career.id}/seasons/${season.id}/matches`,
                match.matchesId,
              );
              await setDoc(matchRef, match);
              successCount++;
            } catch (err) {
              console.error(
                `❌ Erro ao copiar a partida ${match.matchesId}:`,
                err,
              );
            }
          }

          if (successCount === season.matches.length) {
            newClubData[i] = { ...season, matches: [] };
            careerChanged = true;
            console.log(
              `✅ Temporada migrada com sucesso! Array antigo limpo.`,
            );
          } else {
            console.warn(
              `⚠️ Migração parcial (${successCount}/${season.matches.length}). O array antigo NÃO foi apagado por segurança.`,
            );
          }
        }
      }

      if (careerChanged) {
        const careerRef = doc(db, `users/${user.uid}/careers/${career.id}`);
        await updateDoc(careerRef, { clubData: newClubData });
        console.log(
          `✅ Carreira ${career.clubName} atualizada e leve novamente!`,
        );
      }
    }

    console.log("🎉 Processo de migração totalmente finalizado!");
  },
};
