import { getCareerById } from "../../helpers/Getters";
import { updateCareerFirestore } from "../../helpers/Setters";
import { ClubData } from "../../interfaces/club/clubData";
import { auth } from "../Firebase";
import { v4 as uuidv4 } from "uuid";

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

    const previousSeason = career.clubData.find(
      (season) => season.seasonNumber === seasonNumber - 1
    );

    const playersFromPreviousSeason = previousSeason
      ? previousSeason.players
      : [];

    const playersForNewSeason = playersFromPreviousSeason.map((player) => {
      if (player.sell === true) {
        return { ...player, statsLeagues: [] };
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { statsLeagues, ballonDor, ...playerData } = player;

      return {
        ...playerData,
        age: (player.age || 0) + 1,
        contractTime: Math.max(0, (player.contractTime || 0) - 1),
        statsLeagues: [],
        ballonDor: 0,
      };
    });

    const newSeason: ClubData = {
      players: playersForNewSeason,
      seasonNumber,
      id: uuidv4(),
    };

    const updatedClubData = [...career.clubData, newSeason];

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  deleteSeason: async (careerId: string, seasonId: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.filter(
      (season) => season.id !== seasonId
    );

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },
};
