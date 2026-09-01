import type { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { LineupSlot, LineupState } from "../../types";

const getPlayerBySlotId = (
  lineup: LineupState,
  slotId: string,
): Players | null => {
  if (slotId === lineup.goalkeeper.slotId) {
    return lineup.goalkeeper.player;
  }

  for (const line of lineup.lines) {
    for (const slot of line) {
      if (slot.slotId === slotId) {
        return slot.player;
      }
    }
  }

  for (const slot of lineup.bench) {
    if (slot.slotId === slotId) {
      return slot.player;
    }
  }

  return null;
};

export const swapLineupPlayers = (
  lineup: LineupState,
  firstSlotId: string,
  secondSlotId: string,
): LineupState => {
  const firstPlayer = getPlayerBySlotId(lineup, firstSlotId);

  const secondPlayer = getPlayerBySlotId(lineup, secondSlotId);

  if (!firstPlayer && !secondPlayer) {
    return lineup;
  }

  const updateSlot = (slot: LineupSlot): LineupSlot => {
    if (slot.slotId === firstSlotId) {
      return {
        ...slot,
        player: secondPlayer,
      };
    }

    if (slot.slotId === secondSlotId) {
      return {
        ...slot,
        player: firstPlayer,
      };
    }

    return slot;
  };

  return {
    goalkeeper: updateSlot(lineup.goalkeeper),
    lines: lineup.lines.map((line) => line.map(updateSlot)),
    bench: lineup.bench.map(updateSlot),
  };
};
