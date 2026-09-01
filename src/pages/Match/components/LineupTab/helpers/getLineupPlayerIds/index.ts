import type { SavedLineup } from "../../../../../../common/interfaces/Lineup";

export const getLineupPlayerIds = (
  lineup?: SavedLineup | null,
): Set<string> => {
  const playerIds = new Set<string>();

  const addPlayerId = (playerId: string | null | undefined) => {
    if (playerId) {
      playerIds.add(playerId);
    }
  };

  addPlayerId(lineup?.goalkeeper?.playerId);

  lineup?.lines?.forEach((slot) => {
    addPlayerId(slot?.playerId);
  });

  lineup?.bench?.forEach((slot) => {
    addPlayerId(slot?.playerId);
  });

  return playerIds;
};
