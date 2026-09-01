import type { PlayerMatchStat } from "../../../../../../../../common/interfaces/PlayerMatchStat";
import type { Players } from "../../../../../../../../common/interfaces/playersInfo/players";
import { NO_GOAL_AVAILABLE_LABEL } from "../../constants/Substitution";

interface GetAvailableGoalOptionsParams {
  player?: Players;
  players?: Players[];
  playerStats?: PlayerMatchStat[];
}

export const getAvailableGoalOptions = ({
  player,
  players,
  playerStats,
}: GetAvailableGoalOptionsParams): string[] => {
  if (!playerStats || !players || !player) {
    return [];
  }

  const claimedAssists = new Set<string>();

  playerStats.forEach((stat) => {
    if (stat.playerId !== player.id && stat.assistTargets) {
      stat.assistTargets.forEach((target) => {
        claimedAssists.add(target);
      });
    }
  });

  const options: string[] = [];

  playerStats.forEach((stat) => {
    if (stat.playerId === player.id) {
      return;
    }

    const statPlayer = players.find(
      (currentPlayer) => currentPlayer.id === stat.playerId,
    );

    if (statPlayer && stat.goals > 0 && stat.goalMinutes) {
      stat.goalMinutes.forEach((minute) => {
        const goalLabel = `${statPlayer.name} - ${minute}'`;

        if (!claimedAssists.has(goalLabel)) {
          options.push(goalLabel);
        }
      });
    }
  });

  return options.length > 0 ? options : [NO_GOAL_AVAILABLE_LABEL];
};
