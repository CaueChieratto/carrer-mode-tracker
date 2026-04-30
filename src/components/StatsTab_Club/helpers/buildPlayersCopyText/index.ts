import { calculateTotalStats } from "../../components/PlayerStatsList/utils/calculateTotalStats";

type Player = Parameters<typeof calculateTotalStats>[0];

export const buildPlayersCopyText = (players: Player[]): string => {
  return players
    .map((player) => {
      const stats = calculateTotalStats(player);

      const base = `${player.name}, ${stats.games} Jogos, ${stats.minutesPlayed} Minutos jogados, ${
        stats.goals + stats.assists
      } G/A`;

      if (player.position === "GOL") {
        return `${base}, ${stats.cleanSheets} CleanSheets, ${stats.defenses} Defesas, ${stats.assists} Assistências, ${stats.averageRating} ⭐️`;
      }

      return `${base}, ${stats.goals} Gols, ${stats.assists} Assistências, ${stats.averageRating} ⭐️`;
    })
    .join("\n");
};
