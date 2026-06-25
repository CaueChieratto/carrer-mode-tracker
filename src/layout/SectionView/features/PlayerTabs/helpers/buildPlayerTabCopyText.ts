import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { Trophy } from "../../../../../common/interfaces/club/trophy";
import { calculateTotalStats } from "../../ClubTabs/StatsTab_Club/components/PlayerStatsList/utils/calculateTotalStats";
import { Stats } from "../../../../../common/interfaces/playersStats/stats";

export const buildPlayerTabCopyText = (
  type: "SEASON" | "TOTAL_LEAGUE" | "TOTAL",
  player: Players,
  trophies: Trophy[],
  identifier: string | number,
): string => {
  const isGoalkeeper = player.position === "GOL";

  const formatLeagueStats = (stats: Stats, leagueName: string) => {
    const rating = stats.rating || 0;

    if (isGoalkeeper) {
      return `${leagueName}: ${stats.games} Jogos, ${stats.minutesPlayed || 0} Minutos jogados, ${stats.cleanSheets || 0} CleanSheets, ${stats.defenses || 0} Defesas, ${stats.assists || 0} Assistências, ${rating} ⭐,`;
    }

    const participations = (stats.goals || 0) + (stats.assists || 0);
    return `${leagueName}: ${stats.games} Jogos, ${stats.minutesPlayed || 0} Minutos jogados, ${participations} G/A, ${stats.goals || 0} Gols, ${stats.assists || 0} Assistências, ${rating} ⭐,`;
  };

  const getTrophiesText = () => {
    const names = trophies.map((t) => t.leagueName);
    if (names.length === 0) return "";
    if (names.length === 1) return `Campeão de ${names[0]}`;
    const last = names.pop();
    return `Campeão de ${names.join(", ")} e ${last}`;
  };

  const trophiesText = getTrophiesText();

  if (type === "SEASON" || type === "TOTAL_LEAGUE") {
    const leaguesText = (player.statsLeagues || [])
      .map((league) => formatLeagueStats(league.stats, league.leagueName))
      .join("\n");

    const header =
      type === "SEASON"
        ? `${player.name} Temporada ${identifier} {`
        : `${player.name} (Jogou por ${identifier} temporadas) {`;

    return `${header}\n${leaguesText}\n${trophiesText}\n}`;
  }

  if (type === "TOTAL") {
    const totalStats = calculateTotalStats(player);
    const rating = totalStats.averageRating || 0;
    let statsStr = "";

    if (isGoalkeeper) {
      statsStr = `${totalStats.games} Jogos, ${totalStats.minutesPlayed || 0} Minutos jogados, ${totalStats.cleanSheets || 0} CleanSheets, ${totalStats.defenses || 0} Defesas, ${totalStats.assists || 0} Assistências, ${rating} ⭐,`;
    } else {
      const participations =
        (totalStats.goals || 0) + (totalStats.assists || 0);
      statsStr = `${totalStats.games} Jogos, ${totalStats.minutesPlayed || 0} Minutos jogados, ${participations} G/A, ${totalStats.goals || 0} Gols, ${totalStats.assists || 0} Assistências, ${rating} ⭐,`;
    }

    const header = `${player.name} (Jogou por ${identifier} temporadas) {`;
    const footerText = trophiesText ? ` ${trophiesText}` : "";

    return `${header}\n${statsStr}${footerText}\n}`;
  }

  return "";
};
