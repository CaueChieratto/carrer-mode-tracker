import { BENCH_SLOT_PREFIX } from "../../constants/lineupSlots";
import { LineupState } from "../../types";

export const getAssignedPlayerIds = (
  lineup: LineupState,
  selectingSlotId: string | null,
): Set<string> => {
  const assignedPlayerIds = new Set<string>();

  const isSelectingStarter =
    selectingSlotId && !selectingSlotId.startsWith(BENCH_SLOT_PREFIX);

  if (lineup.goalkeeper.player) {
    assignedPlayerIds.add(lineup.goalkeeper.player.id);
  }

  lineup.lines.flat().forEach((slot) => {
    if (slot.player) {
      assignedPlayerIds.add(slot.player.id);
    }
  });

  if (!isSelectingStarter) {
    lineup.bench.forEach((slot) => {
      if (slot.player) {
        assignedPlayerIds.add(slot.player.id);
      }
    });
  }

  return assignedPlayerIds;
};
