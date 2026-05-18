import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getCareerById } from "../../helpers/Getters";
import { updateCareerFirestore } from "../../helpers/Setters";
import { Career } from "../../interfaces/Career";
import { Players } from "../../interfaces/playersInfo/players";
import { LeagueStats } from "../../interfaces/playersStats/leagueStats";
import { parseBrasilDate } from "../../utils/Date";
import { parseValue } from "../../utils/FormatValue";
import { getSeasonDateRange } from "../../utils/GetSeasonDateRange";
import { auth, db } from "../Firebase";
import { v4 as uuidv4 } from "uuid";

export const ServicePlayers = {
  getPlayersBySeason: async (
    careerId: string,
    seasonId: string,
  ): Promise<Players[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const playersRef = collection(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/players`,
    );
    const snapshot = await getDocs(playersRef);

    const parseDate = (val: unknown): Date | null => {
      if (!val) return null;
      if (
        typeof val === "object" &&
        "toDate" in val &&
        typeof (val as { toDate: unknown }).toDate === "function"
      ) {
        return (val as { toDate: () => Date }).toDate();
      }
      return new Date(val as string | Date);
    };

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      const parsedContracts = (data.contract || []).map(
        (c: Record<string, unknown>) => ({
          ...c,
          dataArrival: parseDate(c.dataArrival),
          dataExit: parseDate(c.dataExit),
        }),
      );

      return {
        ...data,
        contract: parsedContracts,
      } as Players;
    });
  },

  migrateOldPlayersToSubcollections: async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    console.log("🔍 Iniciando migração de Jogadores...");
    const careersRef = collection(db, `users/${user.uid}/careers`);
    const snapshot = await getDocs(careersRef);

    for (const careerDoc of snapshot.docs) {
      const career = careerDoc.data() as Career;
      let careerChanged = false;

      if (!career.clubData) continue;
      const newClubData = [...career.clubData];

      for (let i = 0; i < newClubData.length; i++) {
        const season = newClubData[i];

        if (season.players && season.players.length > 0) {
          console.log(
            `⏳ Copiando ${season.players.length} jogadores da temporada ${season.id} (${career.clubName})...`,
          );
          let successCount = 0;

          for (const player of season.players) {
            try {
              const playerRef = doc(
                db,
                `users/${user.uid}/careers/${career.id}/seasons/${season.id}/players`,
                player.id,
              );
              await setDoc(playerRef, player);
              successCount++;
            } catch (err) {
              console.error(`❌ Erro ao copiar jogador ${player.id}:`, err);
            }
          }

          if (successCount === season.players.length) {
            newClubData[i] = { ...season, players: [] };
            careerChanged = true;
          }
        }
      }

      if (careerChanged) {
        const careerRef = doc(db, `users/${user.uid}/careers/${career.id}`);
        await updateDoc(careerRef, { clubData: newClubData });
        console.log(
          `✅ Jogadores da Carreira ${career.clubName} migrados! A carreira agora está super leve.`,
        );
      }
    }
    console.log("🎉 Processo de migração de jogadores finalizado!");
  },

  addPlayerToSeason: async (
    careerId: string,
    seasonId: string,
    player: Omit<Players, "id">,
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);
    let existingPlayerId: string | null = null;

    for (const season of career.clubData) {
      const found = season.players.find(
        (p) =>
          !p.sell &&
          p.name.trim().toLowerCase() === player.name.trim().toLowerCase() &&
          p.nation.trim().toLowerCase() === player.nation.trim().toLowerCase(),
      );
      if (found) {
        existingPlayerId = found.id;
        break;
      }
    }

    const newPlayer: Players = { ...player, id: existingPlayerId || uuidv4() };
    const playerRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      newPlayer.id,
    );

    await setDoc(playerRef, newPlayer);
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  editPlayerInSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    updatedPlayer: Partial<Players>,
  ): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const season = career.clubData.find((s) => s.id === seasonId);
    const player = season?.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Jogador não encontrado");

    const newContractData = updatedPlayer.contract
      ? updatedPlayer.contract[0]
      : null;
    const existingContract = player.contract ? player.contract[0] : {};
    const mergedContract = newContractData
      ? [
          { ...existingContract, ...newContractData },
          ...(player.contract?.slice(1) || []),
        ]
      : player.contract || [];

    const finalPlayer = {
      ...player,
      ...updatedPlayer,
      contract: mergedContract,
    };
    const playerRef = doc(
      db,
      `users/${user!.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer, { merge: true });
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  sellPlayerFromSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    sellValue: string,
    toClub: string,
    dateExit: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    const player = seasonToUpdate?.players.find((p) => p.id === playerId);
    if (!seasonToUpdate || !player) throw new Error("Dados não encontrados");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const contractHistory = player.contract || [];
    let lastContract = contractHistory[contractHistory.length - 1];

    if (!lastContract) {
      lastContract = {
        buyValue: 0,
        fromClub: "",
        sellValue: 0,
        leftClub: "",
        dataArrival: null,
      };
      contractHistory.push(lastContract);
    }

    const [, month] = dateExit.split("/").map(Number);
    const saleMonth = month - 1;
    const sellYear =
      saleMonth < startDate.getMonth()
        ? endDate.getFullYear()
        : startDate.getFullYear();
    const parsedExit = parseBrasilDate(dateExit, sellYear);
    if (!parsedExit) throw new Error("Data de saída inválida");

    lastContract.sellValue = parseValue(sellValue);
    lastContract.leftClub = toClub;
    lastContract.dataExit = parsedExit;

    const finalPlayer = { ...player, sell: true, contract: contractHistory };
    const playerRef = doc(
      db,
      `users/${user!.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  loanPlayerFromSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    buyOption: string,
    toClub: string,
    dateLoan: string,
    loanDuration: string,
    wagePercentage: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    const player = seasonToUpdate?.players.find((p) => p.id === playerId);
    if (!seasonToUpdate || !player) throw new Error("Dados não encontrados");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const contractHistory = player.contract || [];
    let lastContract = contractHistory[contractHistory.length - 1];

    if (!lastContract) {
      lastContract = {
        buyValue: 0,
        fromClub: "",
        sellValue: 0,
        leftClub: "",
        dataArrival: null,
      };
      contractHistory.push(lastContract);
    }

    const [, month] = dateLoan.split("/").map(Number);
    const loanMonth = month - 1;
    const loanYear =
      loanMonth < startDate.getMonth()
        ? endDate.getFullYear()
        : startDate.getFullYear();
    const parsedLoanDate = parseBrasilDate(dateLoan, loanYear);
    if (!parsedLoanDate) throw new Error("Data de empréstimo inválida");

    lastContract.buyOptionValue = parseValue(buyOption);
    lastContract.leftClub = toClub;
    lastContract.dataExit = parsedLoanDate;
    lastContract.isLoan = true;
    lastContract.loanDuration = Number(loanDuration);
    lastContract.wagePercentage = Number(wagePercentage);

    const finalPlayer = {
      ...player,
      loan: true,
      shirtNumber: "",
      contract: contractHistory,
    };
    const playerRef = doc(
      db,
      `users/${user!.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  returnPlayerFromLoan: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    returnDate: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    const player = seasonToUpdate?.players.find((p) => p.id === playerId);
    if (!seasonToUpdate || !player) throw new Error("Dados não encontrados");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation,
    );
    let parsedDate: Date = endDate;

    if (returnDate && returnDate.includes("/")) {
      const parts = returnDate.split("/");
      const month = Number(parts[1]);
      if (!isNaN(month)) {
        const returnMonth = month - 1;
        const returnYear =
          returnMonth < startDate.getMonth()
            ? endDate.getFullYear()
            : startDate.getFullYear();
        const tempDate = parseBrasilDate(returnDate, returnYear);
        if (tempDate) parsedDate = tempDate;
      }
    }

    const contractHistory = player.contract ? [...player.contract] : [];
    const lastContract =
      contractHistory.length > 0
        ? contractHistory[contractHistory.length - 1]
        : null;

    let finalPlayer: Players;
    if (player.incomingLoan) {
      if (lastContract) {
        lastContract.dataExit = parsedDate;
        lastContract.leftClub = lastContract.fromClub || "Fim de Empréstimo";
      }
      finalPlayer = {
        ...player,
        sell: true,
        incomingLoan: false,
        contract: contractHistory,
      };
    } else {
      if (lastContract) {
        contractHistory.push({
          buyValue: 0,
          fromClub: lastContract.leftClub || "Fim de Empréstimo",
          sellValue: 0,
          leftClub: "",
          dataArrival: parsedDate,
          dataExit: null,
        });
      }
      finalPlayer = {
        ...player,
        loan: false,
        sell: false,
        contract: contractHistory,
      };
    }

    const playerRef = doc(
      db,
      `users/${user!.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );
    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  deletePlayerFromSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    const playerRef = doc(
      db,
      `users/${user!.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );
    await deleteDoc(playerRef);
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  addLeagueStatsToPlayer: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    leagueStats: LeagueStats[],
  ): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const season = career.clubData.find((s) => s.id === seasonId);
    const player = season?.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Jogador não encontrado");

    const finalPlayer = {
      ...player,
      statsLeagues: [...(player.statsLeagues || []), ...leagueStats],
    };
    const playerRef = doc(
      db,
      `users/${user!.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  updatePlayerStatsLeagues: async (
    career: Career,
    seasonId: string,
    playerId: string,
    allLeagueStats: LeagueStats[],
  ): Promise<void> => {
    const user = auth.currentUser;
    const playerRef = doc(
      db,
      `users/${user?.uid}/careers/${career.id}/seasons/${seasonId}/players`,
      playerId,
    );
    await setDoc(playerRef, { statsLeagues: allLeagueStats }, { merge: true });
    await updateCareerFirestore(user!.uid, career.id, {
      updatedAt: Date.now(),
    });
  },

  updatePlayerBallonDor: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    ballonDor: number,
  ): Promise<void> => {
    const user = auth.currentUser;
    const playerRef = doc(
      db,
      `users/${user?.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );
    await setDoc(playerRef, { ballonDor }, { merge: true });
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  deleteLeagueStatsFromPlayer: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    leagueName: string,
  ): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const season = career.clubData.find((s) => s.id === seasonId);
    const player = season?.players.find((p) => p.id === playerId);
    if (!player) throw new Error("Jogador não encontrado");

    const updatedStatsLeagues = player.statsLeagues.filter(
      (league) => league.leagueName !== leagueName,
    );
    const playerRef = doc(
      db,
      `users/${user?.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, { ...player, statsLeagues: updatedStatsLeagues });
    await updateCareerFirestore(user!.uid, careerId, { updatedAt: Date.now() });
  },

  fixDuplicatePlayerIds: async (careerId: string): Promise<void> => {
    const user = auth.currentUser;
    const career = await getCareerById(user!.uid, careerId);
    const idMap = new Map<string, string>();
    let hasChanges = false;

    for (const season of career.clubData) {
      for (const player of season.players) {
        const uniqueKey = `${player.name.trim().toLowerCase()}-${player.nation.trim().toLowerCase()}`;
        if (idMap.has(uniqueKey)) {
          const correctId = idMap.get(uniqueKey)!;
          if (player.id !== correctId) {
            hasChanges = true;
            const oldRef = doc(
              db,
              `users/${user!.uid}/careers/${careerId}/seasons/${season.id}/players`,
              player.id,
            );
            await deleteDoc(oldRef);
            const newRef = doc(
              db,
              `users/${user!.uid}/careers/${careerId}/seasons/${season.id}/players`,
              correctId,
            );
            await setDoc(newRef, { ...player, id: correctId });
          }
        } else {
          idMap.set(uniqueKey, player.id);
        }
      }
    }
    if (hasChanges) {
      await updateCareerFirestore(user!.uid, careerId, {
        updatedAt: Date.now(),
      });
      alert(`Carreira corrigida! IDs unificados.`);
    } else {
      alert(`Nenhuma duplicação encontrada.`);
    }
  },
};
