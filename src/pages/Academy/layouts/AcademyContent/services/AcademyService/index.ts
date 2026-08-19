import { getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ServicePlayers } from "../../../../../../common/services/ServicePlayers";
import { AcademyPlayers } from "../../interfaces/AcademyPlayers/AcademyPlayers";
import { AcademyTournaments } from "../../interfaces/AcademyTournaments/AcademyTournaments";
import { PlayerMatchesStats } from "../../interfaces/AcademyTournaments/AcademyMatches/PlayerMatchesStats";
import { Career } from "../../../../../../common/interfaces/Career";
import {
  getAsyncUser,
  getAcademyCollection,
  requireUser,
  getAcademyDoc,
} from "./helpers";
import { buildEvolutionHistory } from "./helpers/buildEvolutionHistory";
import { buildPlayerAcademyTournaments } from "./helpers/buildPlayerAcademyTournaments";
import { buildPromotedPlayer } from "./helpers/buildPromotedPlayer";

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
    const newEvolution = buildEvolutionHistory(
      playerData.arrivalDate,
      "Jogador recrutado para a categoria de base.",
      "none",
      "academy",
    );

    const newAcademyPlayer: AcademyPlayers = {
      ...playerData,
      id: uuidv4(),
      status: "academy",
      evolutionHistory: [newEvolution],
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
    career: Career,
    seasonId: string,
    academyPlayer: AcademyPlayers,
    promotionDate?: string,
  ): Promise<void> => {
    const user = requireUser();
    const pDate = promotionDate || new Date().toLocaleDateString("pt-BR");
    const careerId = career.id;

    const promotionEvolution = buildEvolutionHistory(
      pDate,
      "Promovido ao elenco profissional.",
      "academy",
      "promoted",
    );

    const promotedAcademyPlayer: AcademyPlayers = {
      ...academyPlayer,
      status: "promoted",
      exitDate: pDate,
      evolutionHistory: [...academyPlayer.evolutionHistory, promotionEvolution],
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

    const promises = career.clubData.map((season) =>
      AcademyService.getTournamentsAcademy(careerId, season.id),
    );
    const results = await Promise.all(promises);

    const playerTournaments = buildPlayerAcademyTournaments(
      results.flat(),
      academyPlayer.id,
    );

    const newProPlayer = buildPromotedPlayer(
      promotedAcademyPlayer,
      pDate,
      playerTournaments,
      career.academy?.nickname,
    );

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

    const releaseEvolution = buildEvolutionHistory(
      releaseDate,
      "Atleta dispensado da categoria de base.",
      academyPlayer.status || "academy",
      "released",
    );

    await updateDoc(docRef, {
      status: "released",
      exitDate: releaseDate,
      evolutionHistory: [...academyPlayer.evolutionHistory, releaseEvolution],
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
