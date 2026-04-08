import { useState, useCallback, useMemo } from "react";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { FORMATIONS, Formation } from "../../../constants/Formations";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { SavedLineup } from "../../../types/Lineup";
import {
  buildEmptyLineup,
  resolveInitialFormation,
  resolveInitialState,
} from "../helpers/lineupInitializers";

export type LineupSlot = {
  slotId: string;
  player: Players | null;
};

export type LineupState = {
  goalkeeper: LineupSlot;
  lines: LineupSlot[][];
  bench: LineupSlot[];
};

export const useLineup = (season: ClubData, initialLineup?: SavedLineup) => {
  const initialFormation = useMemo(
    () => resolveInitialFormation(initialLineup),
    [initialLineup],
  );

  const [selectedFormation, setSelectedFormation] =
    useState<Formation>(initialFormation);
  const [lineup, setLineup] = useState<LineupState>(() =>
    resolveInitialState(initialFormation, season, initialLineup),
  );
  const [selectingSlotId, setSelectingSlotId] = useState<string | null>(null);

  const swapPlayers = useCallback((slotIdA: string, slotIdB: string) => {
    setLineup((prev) => {
      const getPlayer = (id: string): Players | null => {
        if (id === prev.goalkeeper.slotId) return prev.goalkeeper.player;
        for (const line of prev.lines) {
          for (const slot of line) {
            if (slot.slotId === id) return slot.player;
          }
        }
        for (const slot of prev.bench) {
          if (slot.slotId === id) return slot.player;
        }
        return null;
      };

      const playerA = getPlayer(slotIdA);
      const playerB = getPlayer(slotIdB);

      if (!playerA && !playerB) return prev;

      const updateSlot = (slot: LineupSlot): LineupSlot => {
        if (slot.slotId === slotIdA) return { ...slot, player: playerB };
        if (slot.slotId === slotIdB) return { ...slot, player: playerA };
        return slot;
      };

      return {
        goalkeeper: updateSlot(prev.goalkeeper),
        lines: prev.lines.map((line) => line.map(updateSlot)),
        bench: prev.bench.map(updateSlot),
      };
    });
  }, []);

  const handleFormationChange = useCallback((formationName: string) => {
    const found = FORMATIONS.find((f) => f.name === formationName);
    if (!found) return;

    setSelectedFormation(found);
    setSelectingSlotId(null);

    setLineup((prev) => {
      const newLineup = buildEmptyLineup(found);
      newLineup.goalkeeper.player = prev.goalkeeper.player;
      newLineup.bench = prev.bench;

      const currentFieldPlayers = prev.lines
        .flat()
        .map((slot) => slot.player)
        .filter((player): player is Players => player !== null);

      let playerIndex = 0;
      newLineup.lines = newLineup.lines.map((line) =>
        line.map((slot) => {
          if (playerIndex < currentFieldPlayers.length) {
            const playerToAssign = currentFieldPlayers[playerIndex++];
            return { ...slot, player: playerToAssign };
          }
          return slot;
        }),
      );

      return newLineup;
    });
  }, []);

  const openPlayerPicker = useCallback((slotId: string) => {
    setSelectingSlotId((prev) => (prev === slotId ? null : slotId));
  }, []);

  const assignPlayer = useCallback(
    (player: Players) => {
      if (!selectingSlotId) return;

      setLineup((prev) => {
        const isTargetGk = selectingSlotId === "gk-0";
        const isTargetBench = selectingSlotId.startsWith("bench-");

        const cleanSlot = (slot: LineupSlot) =>
          slot.player?.id === player.id ? { ...slot, player: null } : slot;

        const cleaned = {
          goalkeeper: cleanSlot(prev.goalkeeper),
          lines: prev.lines.map((line) => line.map(cleanSlot)),
          bench: prev.bench.map(cleanSlot),
        };

        if (isTargetGk) {
          return { ...cleaned, goalkeeper: { ...cleaned.goalkeeper, player } };
        }

        if (isTargetBench) {
          return {
            ...cleaned,
            bench: cleaned.bench.map((slot) =>
              slot.slotId === selectingSlotId ? { ...slot, player } : slot,
            ),
          };
        }

        return {
          ...cleaned,
          lines: cleaned.lines.map((line) =>
            line.map((slot) =>
              slot.slotId === selectingSlotId ? { ...slot, player } : slot,
            ),
          ),
        };
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
      if (slotId.startsWith("bench-")) {
        return {
          ...prev,
          bench: prev.bench.map((slot) =>
            slot.slotId === slotId ? { ...slot, player: null } : slot,
          ),
        };
      }
      return {
        ...prev,
        lines: prev.lines.map((line) =>
          line.map((slot) =>
            slot.slotId === slotId ? { ...slot, player: null } : slot,
          ),
        ),
      };
    });
    setSelectingSlotId(null);
  }, []);

  const buildSavedLineup = useCallback((): SavedLineup => {
    const flatPlayers = lineup.lines.flat().map((slot) => ({
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
      formation: selectedFormation.name,
      goalkeeper: {
        slotId: lineup.goalkeeper.slotId,
        playerId: lineup.goalkeeper.player?.id ?? null,
        playerName: lineup.goalkeeper.player?.name ?? null,
      },
      lines: flatPlayers,
      bench: benchPlayers,
    };
  }, [lineup, selectedFormation]);

  const assignedPlayerIds = useMemo(() => {
    const ids = new Set<string>();
    if (lineup.goalkeeper.player) ids.add(lineup.goalkeeper.player.id);
    lineup.lines.flat().forEach((slot) => {
      if (slot.player) ids.add(slot.player.id);
    });
    lineup.bench.forEach((slot) => {
      if (slot.player) ids.add(slot.player.id);
    });
    return ids;
  }, [lineup]);

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
    buildSavedLineup,
    swapPlayers,
  };
};
