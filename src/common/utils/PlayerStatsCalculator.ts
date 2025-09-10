import { Players } from "../interfaces/playersInfo/players";

export const calculateTotalStats = (player: Players) => {
  const stats = player.statsLeagues.reduce(
    (acc, league) => {
      acc.games += league.stats.games;
      acc.goals += league.stats.goals;
      acc.assists += league.stats.assists;
      acc.cleanSheets += league.stats.cleanSheets;
      acc.ratingSum += league.stats.rating * league.stats.games;
      return acc;
    },
    {
      games: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      ratingSum: 0,
    }
  );

  const averageRating =
    stats.games > 0
      ? parseFloat((stats.ratingSum / stats.games).toFixed(2))
      : 0;

  return {
    games: stats.games,
    goals: stats.goals,
    assists: stats.assists,
    cleanSheets: stats.cleanSheets,
    averageRating: averageRating,
  };
};
