import { EmptySlotRow } from "./components/EmptySlotRow";
import { PlayerRow } from "./components/PlayerRow";
import { UI_TEXT } from "./constants/uiText";
import { buildBenchRows } from "./helpers/buildBenchRows";
import type { BottomProps } from "./types";

import Styles from "./Bottom.module.css";

export const Bottom = ({
  lineup,
  selectingSlotId,
  openPlayerPicker,
  removePlayer,
  onPlayerClick,
  onOpenModal,
  mvpId,
  playerStats,
  allPlayers,
  isFromGeral,
}: BottomProps) => {
  const { benchRows, firstEmptySlot } = buildBenchRows({
    lineup,
    playerStats,
    allPlayers,
    mvpId,
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
        {benchRows.map(
          ({ slot, stats, isMVP, chainSubMinute, chainSubOutName }) => (
            <PlayerRow
              key={slot.slotId}
              slot={slot}
              onRemove={removePlayer}
              onPlayerClick={onPlayerClick}
              onOpenModal={onOpenModal}
              stats={stats}
              isMVP={isMVP}
              allPlayers={allPlayers}
              allStats={playerStats}
              isFromGeral={isFromGeral}
              chainSubMinute={chainSubMinute}
              chainSubOutName={chainSubOutName}
            />
          ),
        )}

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
