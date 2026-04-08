import { LineupState } from "../../../../hooks/useLineup";

export type BenchSlot = LineupState["bench"][number];

type BenchSlotsResult = {
  filledSlots: BenchSlot[];
  firstEmptySlot: BenchSlot | undefined;
};

export function getBenchSlots(lineup: LineupState): BenchSlotsResult {
  const filledSlots = lineup.bench.filter((slot) => slot.player !== null);
  const firstEmptySlot = lineup.bench.find((slot) => slot.player === null);

  return {
    filledSlots,
    firstEmptySlot,
  };
}
