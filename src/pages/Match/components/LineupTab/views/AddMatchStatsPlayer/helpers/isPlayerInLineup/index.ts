import type { Match } from "../../../../../../../../common/interfaces/Match";

export const isPlayerInLineup = (match: Match, playerId: string): boolean => {
  if (!match.lineup || !playerId) {
    return false;
  }

  const playerIds = [
    match.lineup.goalkeeper?.playerId,
    ...(match.lineup.lines?.map((slot) => slot?.playerId) || []),
    ...(match.lineup.bench?.map((slot) => slot?.playerId) || []),
  ].filter((currentPlayerId): currentPlayerId is string =>
    Boolean(currentPlayerId),
  );

  return playerIds.includes(playerId);
};
