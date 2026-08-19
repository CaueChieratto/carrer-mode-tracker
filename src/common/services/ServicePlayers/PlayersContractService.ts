import { doc, setDoc } from "firebase/firestore";
import { getCareerById } from "../../helpers/Getters";
import { updateCareerFirestore } from "../../helpers/Setters";
import { getSeasonDateRange } from "../../utils/GetSeasonDateRange";
import { db } from "../Firebase";
import { requireAuth } from "./helpers/authHelpers";
import {
  buildSellContractHistory,
  buildLoanContractHistory,
  buildReturnContractHistory,
} from "./helpers/contractHelpers";

export const PlayersContractService = {
  sellPlayerFromSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    sellValue: string,
    toClub: string,
    dateExit: string,
  ): Promise<void> => {
    const user = requireAuth();
    const career = await getCareerById(user.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    const player = seasonToUpdate?.players.find((p) => p.id === playerId);

    if (!seasonToUpdate || !player) throw new Error("Dados não encontrados");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const updatedContracts = buildSellContractHistory(
      player,
      sellValue,
      toClub,
      dateExit,
      startDate,
      endDate,
    );

    const finalPlayer = { ...player, sell: true, contract: updatedContracts };
    const playerRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
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
    const user = requireAuth();
    const career = await getCareerById(user.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    const player = seasonToUpdate?.players.find((p) => p.id === playerId);

    if (!seasonToUpdate || !player) throw new Error("Dados não encontrados");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const updatedContracts = buildLoanContractHistory(
      player,
      buyOption,
      toClub,
      dateLoan,
      loanDuration,
      wagePercentage,
      startDate,
      endDate,
    );

    const finalPlayer = {
      ...player,
      loan: true,
      shirtNumber: "",
      contract: updatedContracts,
    };
    const playerRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },

  returnPlayerFromLoan: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    returnDate: string,
  ): Promise<void> => {
    const user = requireAuth();
    const career = await getCareerById(user.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    const player = seasonToUpdate?.players.find((p) => p.id === playerId);

    if (!seasonToUpdate || !player) throw new Error("Dados não encontrados");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation,
    );
    const { contractHistory } = buildReturnContractHistory(
      player,
      returnDate,
      startDate,
      endDate,
    );

    const finalPlayer = player.incomingLoan
      ? {
          ...player,
          sell: true,
          incomingLoan: false,
          contract: contractHistory,
        }
      : { ...player, loan: false, sell: false, contract: contractHistory };

    const playerRef = doc(
      db,
      `users/${user.uid}/careers/${careerId}/seasons/${seasonId}/players`,
      playerId,
    );

    await setDoc(playerRef, finalPlayer);
    await updateCareerFirestore(user.uid, careerId, { updatedAt: Date.now() });
  },
};
