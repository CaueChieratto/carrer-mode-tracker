import { getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { ServicePlayers } from "../../../../../../common/services/ServicePlayers";
import { AcademyPlayers } from "../../interfaces/AcademyPlayers/AcademyPlayers";
import { AcademyTournaments } from "../../interfaces/AcademyTournaments/AcademyTournaments";
import {
  getAsyncUser,
  getAcademyCollection,
  requireUser,
  getAcademyDoc,
} from "./helpers";
import { PlayerMatchesStats } from "../../interfaces/AcademyTournaments/AcademyMatches/PlayerMatchesStats";

export const AcademyService = {
  async getPlayersAcademy(
    careerId: string,
    seasonId: string,
  ): Promise<AcademyPlayers[]> {
    const user = await getAsyncUser();
    const querySnapshot = await getDocs(
      getAcademyCollection(user.uid, careerId, seasonId, "academyPlayers"),
    );
    return querySnapshot.docs.map((doc) => doc.data() as AcademyPlayers);
  },

  async getTournamentsAcademy(
    careerId: string,
    seasonId: string,
  ): Promise<AcademyTournaments[]> {
    const user = await getAsyncUser();
    const querySnapshot = await getDocs(
      getAcademyCollection(user.uid, careerId, seasonId, "academyTournaments"),
    );
    return querySnapshot.docs.map((doc) => doc.data() as AcademyTournaments);
  },

  addPlayerToAcademy: async (
    careerId: string,
    seasonId: string,
    playerData: Omit<AcademyPlayers, "id" | "status" | "evolutionHistory">,
  ): Promise<void> => {
    const user = requireUser();
    const newAcademyPlayer: AcademyPlayers = {
      ...playerData,
      id: uuidv4(),
      status: "academy",
      evolutionHistory: [
        {
          id: uuidv4(),
          date: playerData.arrivalDate,
          description: "Jogador recrutado para a categoria de base.",
          changedAttribute: "status",
          oldValue: "none",
          newValue: "academy",
        },
      ],
    };
    await setDoc(
      getAcademyDoc(
        user.uid,
        careerId,
        seasonId,
        "academyPlayers",
        newAcademyPlayer.id,
      ),
      newAcademyPlayer,
    );
  },

  addTournamentToAcademy: async (
    careerId: string,
    seasonId: string,
    tournamentData: Omit<AcademyTournaments, "id">,
  ): Promise<void> => {
    const user = requireUser();
    const newTournament: AcademyTournaments = {
      ...tournamentData,
      id: uuidv4(),
    };
    await setDoc(
      getAcademyDoc(
        user.uid,
        careerId,
        seasonId,
        "academyTournaments",
        newTournament.id,
      ),
      newTournament,
    );
  },

  updatePlayerAcademy: async (
    careerId: string,
    seasonId: string,
    updatedPlayer: AcademyPlayers,
  ): Promise<void> => {
    const user = requireUser();
    const docRef = getAcademyDoc(
      user.uid,
      careerId,
      seasonId,
      "academyPlayers",
      updatedPlayer.id,
    );

    await updateDoc(docRef, { ...updatedPlayer });
  },

  updateTournamentAcademy: async (
    careerId: string,
    seasonId: string,
    updatedTournament: AcademyTournaments,
  ): Promise<void> => {
    const user = requireUser();
    const docRef = getAcademyDoc(
      user.uid,
      careerId,
      seasonId,
      "academyTournaments",
      updatedTournament.id,
    );

    await updateDoc(docRef, { ...updatedTournament });
  },

  promotePlayerToProfessional: async (
    careerId: string,
    seasonId: string,
    academyPlayer: AcademyPlayers,
    promotionDate?: string,
  ): Promise<void> => {
    const user = requireUser();
    const pDate = promotionDate || new Date().toLocaleDateString("pt-BR");

    const promotedAcademyPlayer: AcademyPlayers = {
      ...academyPlayer,
      status: "promoted",
      exitDate: pDate,
      evolutionHistory: [
        ...academyPlayer.evolutionHistory,
        {
          id: uuidv4(),
          date: pDate,
          description: "Promovido ao elenco profissional.",
          changedAttribute: "status",
          oldValue: "academy",
          newValue: "promoted",
        },
      ],
    };

    await setDoc(
      getAcademyDoc(
        user.uid,
        careerId,
        seasonId,
        "academyPlayers",
        academyPlayer.id,
      ),
      promotedAcademyPlayer,
      { merge: true },
    );

    let parsedArrivalDate = new Date();
    if (promotionDate) {
      const parts = promotionDate.split("/");
      if (parts.length === 3) {
        parsedArrivalDate = new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0]),
        );
      }
    }

    const allTournaments = await AcademyService.getTournamentsAcademy(
      careerId,
      seasonId,
    );

    const playerTournaments = allTournaments
      .map((t) => {
        const matchesWithPlayer =
          t.matches?.filter((m) =>
            m.lineup?.some((l) => l.playerId === academyPlayer.id),
          ) || [];

        if (matchesWithPlayer.length > 0) {
          return {
            ...t,
            matches: matchesWithPlayer.map((m) => ({
              ...m,
              lineup: m.lineup.filter((l) => l.playerId === academyPlayer.id),
            })),
          };
        }
        return null;
      })
      .filter((t): t is AcademyTournaments => t !== null);

    const newProPlayer: Omit<Players, "id"> = {
      name: academyPlayer.name,
      nation: academyPlayer.nationality,
      age: academyPlayer.age,
      position: academyPlayer.position,
      sector: academyPlayer.sector,
      overall: academyPlayer.overall,
      salary: 0,
      playerValue: 0,
      shirtNumber: "",
      buy: false,
      sell: false,
      loan: false,
      incomingLoan: false,
      captain: false,
      contractTime: 0,
      contract: [
        {
          buyValue: 0,
          sellValue: 0,
          fromClub: "Base",
          leftClub: "",
          dataArrival: parsedArrivalDate,
          dataExit: null,
        },
      ],
      statsLeagues: [],
      ballonDor: 0,

      isAcademy: true,
      academyData: academyPlayer,
      academyHistory: promotedAcademyPlayer.evolutionHistory,
      academyTournaments: playerTournaments,
    };

    await ServicePlayers.addPlayerToSeason(careerId, seasonId, newProPlayer);
  },

  releasePlayerAcademy: async (
    careerId: string,
    seasonId: string,
    academyPlayer: AcademyPlayers,
    releaseDate: string,
  ): Promise<void> => {
    const user = requireUser();
    const docRef = getAcademyDoc(
      user.uid,
      careerId,
      seasonId,
      "academyPlayers",
      academyPlayer.id,
    );

    const newEvolution = {
      id: uuidv4(),
      date: releaseDate,
      description: "Atleta dispensado da categoria de base.",
      changedAttribute: "status",
      oldValue: academyPlayer.status || "academy",
      newValue: "released",
    };

    await updateDoc(docRef, {
      status: "released",
      exitDate: releaseDate,
      evolutionHistory: [...academyPlayer.evolutionHistory, newEvolution],
    });
  },

  deletePlayerAcademy: async (
    careerId: string,
    seasonId: string,
    playerId: string,
  ): Promise<void> => {
    const user = requireUser();
    await deleteDoc(
      getAcademyDoc(user.uid, careerId, seasonId, "academyPlayers", playerId),
    );
  },

  deleteTournamentAcademy: async (
    careerId: string,
    seasonId: string,
    tournamentId: string,
  ): Promise<void> => {
    const user = requireUser();
    await deleteDoc(
      getAcademyDoc(
        user.uid,
        careerId,
        seasonId,
        "academyTournaments",
        tournamentId,
      ),
    );
  },

  savePlayerMatchStats: async (
    careerId: string,
    seasonId: string,
    tournamentId: string,
    matchId: string,
    stats: PlayerMatchesStats,
  ): Promise<void> => {
    const user = requireUser();

    const docId = `${tournamentId}/matches/${matchId}/playerStats/${stats.playerId}`;

    await setDoc(
      getAcademyDoc(user.uid, careerId, seasonId, "academyTournaments", docId),
      stats,
      { merge: true },
    );
  },
};
