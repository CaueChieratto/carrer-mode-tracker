import type { GetPlayerChainInfoParams, PlayerChainInfo } from "../../types";

const NO_SUBSTITUTE_VALUE = "Nenhum";

export const getPlayerChainInfo = ({
  playerId,
  starterIds,
  playerStats,
  allPlayers,
}: GetPlayerChainInfoParams): PlayerChainInfo => {
  for (const starterId of starterIds) {
    const orderedPlayerIds = [starterId];
    let currentPlayerId = starterId;

    while (true) {
      let nextPlayerId: string | null = null;

      const currentPlayerStat = playerStats.find(
        (stat) => stat.playerId === currentPlayerId,
      );

      if (
        currentPlayerStat?.substituteIn &&
        currentPlayerStat.substituteIn !== NO_SUBSTITUTE_VALUE
      ) {
        const substitutePlayer = allPlayers.find(
          (player) => player.name === currentPlayerStat.substituteIn,
        );

        if (
          substitutePlayer &&
          !orderedPlayerIds.includes(substitutePlayer.id)
        ) {
          nextPlayerId = substitutePlayer.id;
        }
      }

      if (!nextPlayerId) {
        const currentPlayer = allPlayers.find(
          (player) => player.id === currentPlayerId,
        );

        if (currentPlayer) {
          const playerPointingToCurrent = playerStats.find(
            (stat) =>
              stat.substituteIn === currentPlayer.name &&
              !orderedPlayerIds.includes(stat.playerId),
          );

          if (playerPointingToCurrent) {
            nextPlayerId = playerPointingToCurrent.playerId;
          }
        }
      }

      if (!nextPlayerId) {
        break;
      }

      orderedPlayerIds.push(nextPlayerId);
      currentPlayerId = nextPlayerId;
    }

    const playerIndex = orderedPlayerIds.indexOf(playerId);

    if (playerIndex > 0) {
      let substitutionMinute = 0;

      for (let index = 0; index < playerIndex; index++) {
        const previousPlayerStat = playerStats.find(
          (stat) => stat.playerId === orderedPlayerIds[index],
        );

        substitutionMinute += previousPlayerStat?.minutesPlayed || 0;
      }

      const previousPlayerId = orderedPlayerIds[playerIndex - 1];

      const previousPlayer = allPlayers.find(
        (player) => player.id === previousPlayerId,
      );

      return {
        subMinute: substitutionMinute,
        subOutName: previousPlayer?.name,
      };
    }
  }

  const playerStat = playerStats.find((stat) => stat.playerId === playerId);

  if (
    playerStat?.substituteIn &&
    playerStat.substituteIn !== NO_SUBSTITUTE_VALUE
  ) {
    const substitutedPlayer = allPlayers.find(
      (player) => player.name === playerStat.substituteIn,
    );

    const substitutedPlayerStats = playerStats.find(
      (stat) => stat.playerId === substitutedPlayer?.id,
    );

    return {
      subMinute: substitutedPlayerStats?.minutesPlayed || 0,
      subOutName: substitutedPlayer?.name,
    };
  }

  return {
    subMinute: Infinity,
    subOutName: undefined,
  };
};
