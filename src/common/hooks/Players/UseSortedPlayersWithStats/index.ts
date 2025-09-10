import { useMemo } from "react";
import { Players } from "../../../interfaces/playersInfo/players";
import { sortPlayersWithStatsByPosition } from "../../../utils/Sorts";

export const useSortedPlayersWithStats = (players: Players[]) => {
  const playersWithStats = useMemo(() => {
    const filtered = players.filter(
      (player) => player.statsLeagues && player.statsLeagues.length > 0
    );
    return sortPlayersWithStatsByPosition(filtered);
  }, [players]);

  return playersWithStats;
};
