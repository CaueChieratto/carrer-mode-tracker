import { getCareerById } from "../../helpers/Getters";
import { updateCareerFirestore } from "../../helpers/Setters";
import { Players } from "../../interfaces/playersInfo/players";
import { LeagueStats } from "../../interfaces/playersStats/leagueStats";
import { parseBrasilDate } from "../../utils/Date";
import { parseValue } from "../../utils/FormatValue";
import { getSeasonDateRange } from "../../utils/GetSeasonDateRange";
import { auth } from "../Firebase";
import { v4 as uuidv4 } from "uuid";

export const ServicePlayers = {
  addPlayerToSeason: async (
    careerId: string,
    seasonId: string,
    player: Omit<Players, "id">
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const newPlayer: Players = {
          ...player,
          id: uuidv4(),
        };
        return {
          ...season,
          players: [...season.players, newPlayer],
        };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  editPlayerInSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    updatedPlayer: Partial<Players>
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.map((player) => {
          if (player.id === playerId) {
            const newContractData = updatedPlayer.contract
              ? updatedPlayer.contract[0]
              : null;
            const existingContract = player.contract ? player.contract[0] : {};

            const mergedContract = newContractData
              ? [
                  {
                    ...existingContract,
                    ...newContractData,
                  },
                  ...(player.contract?.slice(1) || []),
                ]
              : player.contract || [];
            return {
              ...player,
              ...updatedPlayer,
              contract: mergedContract,
            };
          }
          return player;
        });
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  sellPlayerFromSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    sellValue: string,
    toClub: string,
    dateExit: string
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);
    const seasonToUpdate = career.clubData.find((s) => s.id === seasonId);
    if (!seasonToUpdate) throw new Error("Temporada não encontrada");

    const { startDate, endDate } = getSeasonDateRange(
      seasonToUpdate.seasonNumber,
      career.createdAt,
      career.nation
    );

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.map((player) => {
          if (player.id === playerId) {
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

            if (!parsedExit) {
              throw new Error("Data de saída inválida");
            }

            lastContract.sellValue = parseValue(sellValue);
            lastContract.leftClub = toClub;
            lastContract.dataExit = parsedExit;

            return { ...player, sell: true, contract: contractHistory };
          }
          return player;
        });
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  deletePlayerFromSeason: async (
    careerId: string,
    seasonId: string,
    playerId: string
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.filter(
          (player) => player.id !== playerId
        );
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  addLeagueStatsToPlayer: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    leagueStats: LeagueStats[]
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.map((player) => {
          if (player.id === playerId) {
            const existingStats = player.statsLeagues || [];
            return {
              ...player,
              statsLeagues: [...existingStats, ...leagueStats],
            };
          }
          return player;
        });
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  updatePlayerStatsLeagues: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    allLeagueStats: LeagueStats[]
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              statsLeagues: allLeagueStats,
            };
          }
          return player;
        });
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  updatePlayerBallonDor: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    ballonDor: number
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.map((player) => {
          if (player.id === playerId) {
            return {
              ...player,
              ballonDor: ballonDor,
            };
          }
          return player;
        });
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },

  deleteLeagueStatsFromPlayer: async (
    careerId: string,
    seasonId: string,
    playerId: string,
    leagueName: string
  ): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    const career = await getCareerById(user.uid, careerId);

    const updatedClubData = career.clubData.map((season) => {
      if (season.id === seasonId) {
        const updatedPlayers = season.players.map((player) => {
          if (player.id === playerId) {
            const updatedStatsLeagues = player.statsLeagues.filter(
              (league) => league.leagueName !== leagueName
            );
            return {
              ...player,
              statsLeagues: updatedStatsLeagues,
            };
          }
          return player;
        });
        return { ...season, players: updatedPlayers };
      }
      return season;
    });

    await updateCareerFirestore(user.uid, careerId, {
      clubData: updatedClubData,
    });
  },
};
