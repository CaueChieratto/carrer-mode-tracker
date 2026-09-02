import type { PlayerIdentity } from "../../types";

const normalize = (value: string): string => value.trim().toLowerCase();

export const matchesPlayerIdentity = (
  player: PlayerIdentity,
  referencePlayer: PlayerIdentity,
): boolean =>
  normalize(player.name) === normalize(referencePlayer.name) &&
  normalize(player.nation) === normalize(referencePlayer.nation);
