import { useState, useCallback, useMemo } from "react";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { FORMATIONS, Formation } from "../../../constants/Formations";
import { ClubData } from "../../../../../common/interfaces/club/clubData";

export type LineupSlot = {
  slotId: string;
  player: Players | null;
};

export type LineupState = {
  goalkeeper: LineupSlot;
  lines: LineupSlot[][];
};

const buildEmptyLineup = (formation: Formation): LineupState => {
  return {
    goalkeeper: { slotId: "gk-0", player: null },
    lines: formation.lines.map((line, lineIndex) =>
      line[0] !== undefined
        ? Array.from({ length: line[0] }, (_, slotIndex) => ({
            slotId: `line-${lineIndex}-${slotIndex}`,
            player: null,
          }))
        : [],
    ),
  };
};

export const useLineup = (season: ClubData) => {
  const [selectedFormation, setSelectedFormation] = useState<Formation>(
    FORMATIONS[2],
  );
  const [lineup, setLineup] = useState<LineupState>(() =>
    buildEmptyLineup(FORMATIONS[2]),
  );
  const [selectingSlotId, setSelectingSlotId] = useState<string | null>(null);

  const handleFormationChange = useCallback((formationName: string) => {
    const found = FORMATIONS.find((f) => f.name === formationName);
    if (!found) return;
    setSelectedFormation(found);
    setLineup(buildEmptyLineup(found));
    setSelectingSlotId(null);
  }, []);

  const openPlayerPicker = useCallback((slotId: string) => {
    setSelectingSlotId((prev) => (prev === slotId ? null : slotId));
  }, []);

  const assignPlayer = useCallback(
    (player: Players) => {
      if (!selectingSlotId) return;

      setLineup((prev) => {
        const removeFromAll = (state: LineupState): LineupState => {
          const newGK =
            state.goalkeeper.player?.id === player.id
              ? { ...state.goalkeeper, player: null }
              : state.goalkeeper;

          const newLines = state.lines.map((line) =>
            line.map((slot) =>
              slot.player?.id === player.id ? { ...slot, player: null } : slot,
            ),
          );
          return { goalkeeper: newGK, lines: newLines };
        };

        const cleaned = removeFromAll(prev);

        if (selectingSlotId === "gk-0") {
          return { ...cleaned, goalkeeper: { ...cleaned.goalkeeper, player } };
        }

        const newLines = cleaned.lines.map((line) =>
          line.map((slot) =>
            slot.slotId === selectingSlotId ? { ...slot, player } : slot,
          ),
        );
        return { ...cleaned, lines: newLines };
      });

      setSelectingSlotId(null);
    },
    [selectingSlotId],
  );

  const removePlayer = useCallback((slotId: string) => {
    setLineup((prev) => {
      if (slotId === "gk-0") {
        return { ...prev, goalkeeper: { ...prev.goalkeeper, player: null } };
      }
      const newLines = prev.lines.map((line) =>
        line.map((slot) =>
          slot.slotId === slotId ? { ...slot, player: null } : slot,
        ),
      );
      return { ...prev, lines: newLines };
    });
    setSelectingSlotId(null);
  }, []);

  const assignedPlayerIds = new Set<string>();
  if (lineup.goalkeeper.player)
    assignedPlayerIds.add(lineup.goalkeeper.player.id);
  lineup.lines.forEach((line) =>
    line.forEach((slot) => {
      if (slot.player) assignedPlayerIds.add(slot.player.id);
    }),
  );

  const activePlayers = useMemo(
    () => season.players.filter((p) => !p.sell),
    [season.players],
  );

  return {
    selectedFormation,
    lineup,
    selectingSlotId,
    assignedPlayerIds,
    activePlayers,
    handleFormationChange,
    openPlayerPicker,
    assignPlayer,
    removePlayer,
  };
};
