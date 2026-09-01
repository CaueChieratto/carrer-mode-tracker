import type { Match } from "../../../../../../../../common/interfaces/Match";
import type { PlayerMatchStat } from "../../../../../../../../common/interfaces/PlayerMatchStat";
import type { Players } from "../../../../../../../../common/interfaces/playersInfo/players";
import { NO_SUBSTITUTE_VALUE } from "../../constants/Substitution";

interface CalculateChainMinutesParams {
  startPlayerIds: string[];
  playerStats: PlayerMatchStat[];
  players: Players[];
  excludedPlayerIds?: ReadonlySet<string>;
  getStat?: (playerId: string) => PlayerMatchStat | undefined;
}

export const getMaximumMatchMinutes = (match: Match): number => {
  if (match.hasExtraTime) {
    return (
      120 +
      (match.stoppage1T || 0) +
      (match.stoppage2T || 0) +
      (match.stoppageET1 || 0) +
      (match.stoppageET2 || 0)
    );
  }

  return 90 + (match.stoppage1T || 0) + (match.stoppage2T || 0);
};

export const calculateSubstitutionChainMinutes = ({
  startPlayerIds,
  playerStats,
  players,
  excludedPlayerIds = new Set<string>(),
  getStat,
}: CalculateChainMinutesParams): number => {
  const findStat =
    getStat ||
    ((playerId: string) =>
      playerStats.find((stat) => stat.playerId === playerId));

  const visitedPlayerIds = new Set<string>();
  const queue = [...startPlayerIds];
  let totalMinutes = 0;

  while (queue.length > 0) {
    const currentPlayerId = queue.shift();

    if (currentPlayerId === undefined) {
      continue;
    }

    if (visitedPlayerIds.has(currentPlayerId)) {
      continue;
    }

    visitedPlayerIds.add(currentPlayerId);

    if (!excludedPlayerIds.has(currentPlayerId)) {
      const currentStat = findStat(currentPlayerId);
      totalMinutes += currentStat?.minutesPlayed || 0;
    }

    const currentStat = findStat(currentPlayerId);

    if (
      currentStat?.substituteIn &&
      currentStat.substituteIn !== NO_SUBSTITUTE_VALUE
    ) {
      const substitutePlayer = players.find(
        (player) => player.name === currentStat.substituteIn,
      );

      if (substitutePlayer && !visitedPlayerIds.has(substitutePlayer.id)) {
        queue.push(substitutePlayer.id);
      }
    }

    const currentPlayer = players.find(
      (player) => player.id === currentPlayerId,
    );

    if (!currentPlayer) {
      continue;
    }

    playerStats.forEach((stat) => {
      if (
        stat.substituteIn === currentPlayer.name &&
        !visitedPlayerIds.has(stat.playerId)
      ) {
        queue.push(stat.playerId);
      }
    });
  }

  return totalMinutes;
};

interface CalculateSubstituteMinutesParams {
  value: string;
  currentMinutes: string | number | undefined;
  playerId: string;
  match: Match;
  playerStats?: PlayerMatchStat[];
  players?: Players[];
}

export const calculateSubstituteMinutes = ({
  value,
  currentMinutes,
  playerId,
  match,
  playerStats,
  players,
}: CalculateSubstituteMinutesParams): string | undefined => {
  if (value === NO_SUBSTITUTE_VALUE || !playerStats || !players) {
    return undefined;
  }

  const outPlayer = players.find((player) => player.name === value);

  if (!outPlayer) {
    return undefined;
  }

  const otherMinutes = calculateSubstitutionChainMinutes({
    startPlayerIds: [outPlayer.id],
    playerStats,
    players,
    excludedPlayerIds: new Set([playerId]),
  });

  const currentPlayerMinutes = Number(currentMinutes) || 0;

  if (otherMinutes > 0 && currentPlayerMinutes === 0) {
    return String(Math.max(0, getMaximumMatchMinutes(match) - otherMinutes));
  }

  return undefined;
};
