import { Players } from "../interfaces/playersInfo/players";
import { POSITION_DATA, getGroupForPosition } from "../types/Positions";
import { sortPlayersByPositionWithinGroup } from "../utils/Sorts";

export const groupAndSortPlayersByPosition = (
  players: Players[]
): Map<string, Players[]> => {
  const activePlayers = (players || []).filter((player) => !player.sell);

  const grouped = new Map<string, Players[]>(
    POSITION_DATA.map((group) => [group.key, []])
  );

  for (const player of activePlayers) {
    const group = getGroupForPosition(player.position as string);
    if (group) {
      grouped.get(group.key)?.push(player);
    }
  }

  grouped.forEach((playersInGroup, groupKey) => {
    if (playersInGroup.length > 1) {
      const groupConfig = POSITION_DATA.find((g) => g.key === groupKey);
      if (groupConfig?.sortOrder) {
        const sortedPlayers = sortPlayersByPositionWithinGroup(
          playersInGroup,
          groupConfig.sortOrder
        );
        grouped.set(groupKey, sortedPlayers);
      }
    }
  });

  return grouped;
};
