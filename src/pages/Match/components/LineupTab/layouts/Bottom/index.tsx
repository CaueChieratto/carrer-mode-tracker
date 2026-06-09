import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import {
  getGroupForPosition,
  POSITION_DATA,
} from "../../../../../../common/types/Positions";
import { PlayerMatchStat } from "../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/PlayerMatchStat";
import { LineupState } from "../../hooks/useLineup";
import Styles from "./Bottom.module.css";
import { EmptySlotRow } from "./components/EmptySlotRow";
import { PlayerRow } from "./components/PlayerRow";
import { UI_TEXT } from "./constants/uiText";
import { getBenchSlots } from "./helpers/getBenchSlots";

type BottomProps = {
  lineup: LineupState;
  selectingSlotId: string | null;
  openPlayerPicker: (slotId: string) => void;
  removePlayer: (slotId: string) => void;
  onPlayerClick: (playerId: string) => void;
  playerStats: PlayerMatchStat[];
  mvpId: string | null;
  allPlayers: Players[];
  isFromGeral?: boolean;
};

export const Bottom = ({
  lineup,
  selectingSlotId,
  openPlayerPicker,
  removePlayer,
  onPlayerClick,
  mvpId,
  playerStats,
  allPlayers,
  isFromGeral,
}: BottomProps) => {
  const { filledSlots, firstEmptySlot } = getBenchSlots(lineup);

  const starterIds = [
    lineup.goalkeeper.player?.id,
    ...lineup.lines.flat().map((s) => s.player?.id),
  ].filter(Boolean) as string[];

  const getPlayerChainInfo = (playerId: string) => {
    for (const sId of starterIds) {
      const ordered = [sId];
      let curr = sId;

      while (true) {
        let next: string | null = null;
        const currStat = playerStats.find((s) => s.playerId === curr);
        if (currStat?.substituteIn && currStat.substituteIn !== "Nenhum") {
          const p = allPlayers.find((p) => p.name === currStat.substituteIn);
          if (p && !ordered.includes(p.id)) next = p.id;
        }
        if (!next) {
          const currPlayer = allPlayers.find((p) => p.id === curr);
          if (currPlayer) {
            const pointedBy = playerStats.find(
              (s) =>
                s.substituteIn === currPlayer.name &&
                !ordered.includes(s.playerId),
            );
            if (pointedBy) next = pointedBy.playerId;
          }
        }
        if (next) {
          ordered.push(next);
          curr = next;
        } else {
          break;
        }
      }

      const playerIndex = ordered.indexOf(playerId);
      if (playerIndex > 0) {
        let subMinute = 0;
        for (let k = 0; k < playerIndex; k++) {
          const prevStat = playerStats.find((s) => s.playerId === ordered[k]);
          subMinute += prevStat?.minutesPlayed || 0;
        }
        const prevPlayer = allPlayers.find(
          (p) => p.id === ordered[playerIndex - 1],
        );
        return { subMinute, subOutName: prevPlayer?.name };
      }
    }

    const stat = playerStats.find((s) => s.playerId === playerId);
    if (stat?.substituteIn && stat.substituteIn !== "Nenhum") {
      const outPlayer = allPlayers.find((p) => p.name === stat.substituteIn);
      const outStats = playerStats.find((s) => s.playerId === outPlayer?.id);
      return {
        subMinute: outStats?.minutesPlayed || 0,
        subOutName: outPlayer?.name,
      };
    }

    return { subMinute: Infinity, subOutName: undefined };
  };

  const sortedFilledSlots = [...filledSlots].sort((a, b) => {
    const aMinute = getPlayerChainInfo(a.player!.id).subMinute;
    const bMinute = getPlayerChainInfo(b.player!.id).subMinute;

    if (aMinute !== bMinute) {
      return aMinute - bMinute;
    }

    const aPosition = a.player?.position;
    const bPosition = b.player?.position;

    if (!aPosition || !bPosition) return 0;

    const groupA = getGroupForPosition(aPosition);
    const groupB = getGroupForPosition(bPosition);

    if (!groupA || !groupB) return 0;

    const groupAIndex = POSITION_DATA.findIndex((g) => g.key === groupA.key);
    const groupBIndex = POSITION_DATA.findIndex((g) => g.key === groupB.key);

    if (groupAIndex !== groupBIndex) {
      return groupAIndex - groupBIndex;
    }

    const sortOrder = groupA.sortOrder || groupA.positions;
    const aIndex = sortOrder.indexOf(aPosition);
    const bIndex = sortOrder.indexOf(bPosition);

    const safeAIndex = aIndex !== -1 ? aIndex : 999;
    const safeBIndex = bIndex !== -1 ? bIndex : 999;

    return safeAIndex - safeBIndex;
  });

  return (
    <div
      className={Styles.container}
      style={
        isFromGeral
          ? {
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomLeftRadius: "12px",
              borderBottomRightRadius: "12px",
            }
          : undefined
      }
    >
      <h3 className={Styles.title}>{UI_TEXT.title}</h3>

      <div className={Styles.list}>
        {sortedFilledSlots.map((slot) => {
          const stats = slot.player
            ? playerStats.find((s) => s.playerId === slot.player!.id)
            : undefined;
          const isMVP = slot.player ? mvpId === slot.player!.id : false;
          const chainInfo = getPlayerChainInfo(slot.player!.id);

          return (
            <PlayerRow
              key={slot.slotId}
              slot={slot}
              onRemove={removePlayer}
              onPlayerClick={onPlayerClick}
              stats={stats}
              isMVP={isMVP}
              allPlayers={allPlayers}
              allStats={playerStats}
              isFromGeral={isFromGeral}
              chainSubMinute={chainInfo.subMinute}
              chainSubOutName={chainInfo.subOutName}
            />
          );
        })}

        {firstEmptySlot && !isFromGeral && (
          <EmptySlotRow
            slotId={firstEmptySlot.slotId}
            isActive={selectingSlotId === firstEmptySlot.slotId}
            onSelect={openPlayerPicker}
          />
        )}
      </div>
    </div>
  );
};
