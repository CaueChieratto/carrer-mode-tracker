import type { BuildBenchRowsParams, PlayerChainInfo } from "../../types";
import { comparePlayerPositions } from "../comparePlayerPositions";
import { getBenchSlots } from "../getBenchSlots";
import { getPlayerChainInfo } from "../getPlayerChainInfo";

type BenchSlot = ReturnType<typeof getBenchSlots>["filledSlots"][number];

type BenchPlayerStat = BuildBenchRowsParams["playerStats"][number];

interface BenchPlayerRow {
  slot: BenchSlot;
  stats: BenchPlayerStat | undefined;
  isMVP: boolean;
  chainSubMinute: number;
  chainSubOutName: string | undefined;
}

const isPlayerId = (playerId: string | null | undefined): playerId is string =>
  Boolean(playerId);

const getStarterPlayerIds = (
  lineup: BuildBenchRowsParams["lineup"],
): string[] =>
  [
    lineup.goalkeeper.player?.id,
    ...lineup.lines.flat().map((slot) => slot?.player?.id),
  ].filter(isPlayerId);

export const buildBenchRows = ({
  lineup,
  playerStats,
  allPlayers,
  mvpId,
}: BuildBenchRowsParams) => {
  const { filledSlots, firstEmptySlot } = getBenchSlots(lineup);

  const starterIds = getStarterPlayerIds(lineup);
  const chainInfoByPlayerId = new Map<string, PlayerChainInfo>();

  filledSlots.forEach((slot) => {
    const playerId = slot.player?.id;

    if (!playerId) {
      return;
    }

    chainInfoByPlayerId.set(
      playerId,
      getPlayerChainInfo({
        playerId,
        starterIds,
        playerStats,
        allPlayers,
      }),
    );
  });

  const sortedFilledSlots = [...filledSlots].sort((firstSlot, secondSlot) => {
    const firstPlayer = firstSlot.player;
    const secondPlayer = secondSlot.player;

    if (!firstPlayer || !secondPlayer) {
      return 0;
    }

    const firstMinute =
      chainInfoByPlayerId.get(firstPlayer.id)?.subMinute ?? Infinity;

    const secondMinute =
      chainInfoByPlayerId.get(secondPlayer.id)?.subMinute ?? Infinity;

    if (firstMinute !== secondMinute) {
      return firstMinute - secondMinute;
    }

    return comparePlayerPositions(firstPlayer.position, secondPlayer.position);
  });

  const benchRows: BenchPlayerRow[] = [];

  sortedFilledSlots.forEach((slot) => {
    const player = slot.player;

    if (!player) {
      return;
    }

    const chainInfo = chainInfoByPlayerId.get(player.id) ?? {
      subMinute: Infinity,
      subOutName: undefined,
    };

    benchRows.push({
      slot,
      stats: playerStats.find((stat) => stat.playerId === player.id),
      isMVP: mvpId === player.id,
      chainSubMinute: chainInfo.subMinute,
      chainSubOutName: chainInfo.subOutName,
    });
  });

  return {
    benchRows,
    firstEmptySlot,
  };
};
