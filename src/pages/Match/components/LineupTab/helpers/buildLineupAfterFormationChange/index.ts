import type { Formation } from "../../../../constants/Formations";
import { LineupSlot, LineupState } from "../../types";
import { buildEmptyLineup } from "../lineupInitializers";

const hasPlayer = (
  player: LineupSlot["player"],
): player is NonNullable<LineupSlot["player"]> => player !== null;

export const buildLineupAfterFormationChange = (
  currentLineup: LineupState,
  formation: Formation,
): LineupState => {
  const newLineup = buildEmptyLineup(formation);

  newLineup.goalkeeper.player = currentLineup.goalkeeper.player;

  newLineup.bench = currentLineup.bench;

  const currentFieldPlayers = currentLineup.lines
    .flat()
    .map((slot) => slot.player)
    .filter(hasPlayer);

  let playerIndex = 0;

  newLineup.lines = newLineup.lines.map((line) =>
    line.map((slot) => {
      if (playerIndex >= currentFieldPlayers.length) {
        return slot;
      }

      const player = currentFieldPlayers[playerIndex];
      playerIndex += 1;

      return {
        ...slot,
        player,
      };
    }),
  );

  return newLineup;
};
