import { Players } from "../../../../../../../common/interfaces/playersInfo/players";

export const findPlayerInList = (
  players: Players[],
  targetPlayer: Players,
): Players | undefined => {
  const normalizedName = targetPlayer.name.trim().toLowerCase();
  const normalizedNation = targetPlayer.nation.trim().toLowerCase();

  return players.find(
    (p) =>
      p.name.trim().toLowerCase() === normalizedName &&
      p.nation.trim().toLowerCase() === normalizedNation,
  );
};
