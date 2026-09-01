import {
  BENCH_SLOT_PREFIX,
  GOALKEEPER_SLOT_ID,
} from "../../constants/lineupSlots";
import { LineupState } from "../../types";

export const removePlayerFromSlot = (
  lineup: LineupState,
  slotId: string,
): LineupState => {
  if (slotId === GOALKEEPER_SLOT_ID) {
    return {
      ...lineup,
      goalkeeper: {
        ...lineup.goalkeeper,
        player: null,
      },
    };
  }

  if (slotId.startsWith(BENCH_SLOT_PREFIX)) {
    return {
      ...lineup,
      bench: lineup.bench.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              player: null,
            }
          : slot,
      ),
    };
  }

  return {
    ...lineup,
    lines: lineup.lines.map((line) =>
      line.map((slot) =>
        slot.slotId === slotId
          ? {
              ...slot,
              player: null,
            }
          : slot,
      ),
    ),
  };
};
