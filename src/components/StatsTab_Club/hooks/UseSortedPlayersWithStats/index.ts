import { useMemo } from "react";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { Match } from "../../../../components/AllMatchesTab/types/Match";
import { sortPlayersWithStatsByPosition } from "./utils/sortPlayersWithStatsByPosition";

export const useSortedPlayersWithStats = (
  players: Players[],
  matches?: Match[],
) => {
  const playersWithStats = useMemo(() => {
    const filtered = players.filter((player) => {
      const hasLeagueStats =
        player.statsLeagues && player.statsLeagues.length > 0;
      const hasMatchStats = matches?.some((match) =>
        match.playerStats?.some((stat) => stat.playerId === player.id),
      );

      return hasLeagueStats || hasMatchStats;
    });
    return sortPlayersWithStatsByPosition(filtered);
  }, [players, matches]);

  return playersWithStats;
};
