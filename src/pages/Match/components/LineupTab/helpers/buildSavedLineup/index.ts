import type { SavedLineup } from "../../../../../../common/interfaces/Lineup";
import type { Formation } from "../../../../constants/Formations";
import { LineupState } from "../../types";

export const buildSavedLineupSnapshot = (
  lineup: LineupState,
  formation: Formation,
): SavedLineup => {
  const fieldPlayers = lineup.lines.flat().map((slot) => ({
    slotId: slot.slotId,
    playerId: slot.player?.id ?? null,
    playerName: slot.player?.name ?? null,
  }));

  const benchPlayers = lineup.bench.map((slot) => ({
    slotId: slot.slotId,
    playerId: slot.player?.id ?? null,
    playerName: slot.player?.name ?? null,
  }));

  return {
    formation: formation.name,
    goalkeeper: {
      slotId: lineup.goalkeeper.slotId,
      playerId: lineup.goalkeeper.player?.id ?? null,
      playerName: lineup.goalkeeper.player?.name ?? null,
    },
    lines: fieldPlayers,
    bench: benchPlayers,
  };
};
