import { useState, useCallback, useMemo } from "react";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { FORMATIONS, Formation } from "../../../constants/Formations";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { SavedLineup } from "../../../types/Lineup";

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

export const useLineup = (season: ClubData, initialLineup?: SavedLineup) => {
  const resolveInitialFormation = (): Formation => {
    if (initialLineup) {
      const found = FORMATIONS.find((f) => f.name === initialLineup.formation);
      if (found) return found;
    }
    return FORMATIONS[2];
  };

  const resolveInitialState = (formation: Formation): LineupState => {
    const base = buildEmptyLineup(formation);

    if (!initialLineup) return base;

    const activePlayers = season.players;

    const findPlayer = (playerId: string | null): Players | null => {
      if (!playerId) return null;
      return activePlayers.find((p) => p.id === playerId) ?? null;
    };

    return {
      goalkeeper: {
        ...base.goalkeeper,
        player: findPlayer(initialLineup.goalkeeper.playerId),
      },
      lines: base.lines.map((line) =>
        line.map((slot) => {
          const savedSlot = initialLineup.lines.find(
            (p) => p.slotId === slot.slotId,
          );
          return {
            ...slot,
            player: findPlayer(savedSlot?.playerId ?? null),
          };
        }),
      ),
    };
  };

  const swapPlayers = useCallback((slotIdA: string, slotIdB: string) => {
    setLineup((prev) => {
      const getPlayer = (id: string): Players | null => {
        if (id === prev.goalkeeper.slotId) return prev.goalkeeper.player;
        for (const line of prev.lines) {
          for (const slot of line) {
            if (slot.slotId === id) return slot.player;
          }
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
      };
    });
  }, []);

  const initialFormation = resolveInitialFormation();

  const [selectedFormation, setSelectedFormation] =
    useState<Formation>(initialFormation);
  const [lineup, setLineup] = useState<LineupState>(() =>
    resolveInitialState(initialFormation),
  );
  const [selectingSlotId, setSelectingSlotId] = useState<string | null>(null);

  const handleFormationChange = useCallback((formationName: string) => {
    const found = FORMATIONS.find((f) => f.name === formationName);
    if (!found) return;

    setSelectedFormation(found);

    setLineup((prev) => {
      const newLineup = buildEmptyLineup(found);

      newLineup.goalkeeper = {
        ...newLineup.goalkeeper,
        player: prev.goalkeeper.player,
      };

      const currentFieldPlayers = prev.lines
        .flat()
        .map((slot) => slot.player)
        .filter((player): player is Players => player !== null);

      let playerIndex = 0;
      const newLines = newLineup.lines.map((line) =>
        line.map((slot) => {
          if (playerIndex < currentFieldPlayers.length) {
            const playerToAssign = currentFieldPlayers[playerIndex];
            playerIndex++;
            return { ...slot, player: playerToAssign };
          }
          return slot;
        }),
      );

      return { ...newLineup, lines: newLines };
    });

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

  const buildSavedLineup = useCallback((): SavedLineup => {
    const flatPlayers = lineup.lines.flat().map((slot) => ({
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
    };
  }, [lineup, selectedFormation]);

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
    buildSavedLineup,
    swapPlayers,
  };
};
