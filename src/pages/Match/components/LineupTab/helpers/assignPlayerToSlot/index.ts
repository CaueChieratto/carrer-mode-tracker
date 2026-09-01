import type { Players } from "../../../../../../common/interfaces/playersInfo/players";
import {
  BENCH_SLOT_PREFIX,
  GOALKEEPER_SLOT_ID,
} from "../../constants/lineupSlots";
import { LineupSlot, LineupState } from "../../types";

const removePlayerFromSlot = (
  slot: LineupSlot,
  playerId: string,
): LineupSlot =>
  slot.player?.id === playerId
    ? {
        ...slot,
        player: null,
      }
    : slot;

export const assignPlayerToSlot = (
  lineup: LineupState,
  targetSlotId: string,
  player: Players,
): LineupState => {
  const cleanedLineup: LineupState = {
    goalkeeper: removePlayerFromSlot(lineup.goalkeeper, player.id),
    lines: lineup.lines.map((line) =>
      line.map((slot) => removePlayerFromSlot(slot, player.id)),
    ),
    bench: lineup.bench.map((slot) => removePlayerFromSlot(slot, player.id)),
  };

  if (targetSlotId === GOALKEEPER_SLOT_ID) {
    return {
      ...cleanedLineup,
      goalkeeper: {
        ...cleanedLineup.goalkeeper,
        player,
      },
    };
  }

  if (targetSlotId.startsWith(BENCH_SLOT_PREFIX)) {
    return {
      ...cleanedLineup,
      bench: cleanedLineup.bench.map((slot) =>
        slot.slotId === targetSlotId
          ? {
              ...slot,
              player,
            }
          : slot,
      ),
    };
  }

  return {
    ...cleanedLineup,
    lines: cleanedLineup.lines.map((line) =>
      line.map((slot) =>
        slot.slotId === targetSlotId
          ? {
              ...slot,
              player,
            }
          : slot,
      ),
    ),
  };
};
