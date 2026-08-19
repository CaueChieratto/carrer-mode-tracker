import { Players } from "../../../../../../../common/interfaces/playersInfo/players";

export const getAcademyConsolidatedStats = (player: Players) => {
  let games = 0,
    goals = 0,
    assists = 0,
    cleanSheets = 0,
    ratingSum = 0,
    defenses = 0;

  if (player.academyTournaments && player.academyTournaments.length > 0) {
    player.academyTournaments.forEach((tournament) => {
      if (tournament.matches) {
        tournament.matches.forEach((match) => {
          games += 1;
          const playerStats = match.lineup?.[0];

          if (playerStats) {
            type AcademyStatsExtend = typeof playerStats & {
              defesas?: number;
              defenses?: number;
            };

            const stats = playerStats as AcademyStatsExtend;

            goals += stats.goals || 0;
            assists += stats.assists || 0;
            defenses += stats.defesas || stats.defenses || 0;
            ratingSum += stats.rating || 0;
            cleanSheets += stats.cleanSheets || 0;
          }
        });
      }
    });
  }

  return {
    games,
    goals,
    assists,
    defenses,
    ratingSum,
    cleanSheets,
  };
};
