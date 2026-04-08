import { Formation, FORMATIONS } from "../../../constants/Formations";
import { Players } from "../../../../../common/interfaces/playersInfo/players";
import { ClubData } from "../../../../../common/interfaces/club/clubData";
import { SavedLineup } from "../../../types/Lineup";
import { LineupState } from "../hooks/useLineup";

export const buildEmptyLineup = (formation: Formation): LineupState => {
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
    bench: Array.from({ length: 10 }, (_, slotIndex) => ({
      slotId: `bench-${slotIndex}`,
      player: null,
    })),
  };
};

export const resolveInitialFormation = (
  initialLineup?: SavedLineup,
): Formation => {
  if (initialLineup) {
    const found = FORMATIONS.find((f) => f.name === initialLineup.formation);
    if (found) return found;
  }
  return FORMATIONS[2];
};

export const resolveInitialState = (
  formation: Formation,
  season: ClubData,
  initialLineup?: SavedLineup,
): LineupState => {
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
    bench: base.bench.map((slot) => {
      const savedSlot = initialLineup.bench?.find(
        (p) => p.slotId === slot.slotId,
      );
      return {
        ...slot,
        player: findPlayer(savedSlot?.playerId ?? null),
      };
    }),
  };
};
