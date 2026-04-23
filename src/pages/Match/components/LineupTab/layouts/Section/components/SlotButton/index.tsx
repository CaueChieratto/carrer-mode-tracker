import { UseMatchRatingColor } from "../../../../../../../../common/hooks/Colors/GetOverallColor";
import { PlayerMatchStat } from "../../../../../../../../components/AllMatchesTab/types/PlayerMatchStat";
import { LineupSlot } from "../../../../hooks/useLineup";
import { PlayerDetails } from "./components/PlayerDetails";
import { useSlotDrag } from "./hooks/useSlotDrag";
import Styles from "./SlotButton.module.css";

type SlotButtonProps = {
  slot: LineupSlot;
  isSelecting: boolean;
  onOpen: () => void;
  onRemove: () => void;
  onSwap: (targetId: string) => void;
  onPlayerClick: (playerId: string) => void;
  playerStats: PlayerMatchStat[];
  mvpId: string | null;
  isFromGeral?: boolean;
};

export const SlotButton = ({
  slot,
  isSelecting,
  onOpen,
  onRemove,
  onSwap,
  onPlayerClick,
  mvpId,
  playerStats,
  isFromGeral,
}: SlotButtonProps) => {
  const stats = slot.player
    ? playerStats.find((s) => s.playerId === slot.player!.id)
    : undefined;
  const ratingValue = stats?.rating;
  const backgroundColor = UseMatchRatingColor(ratingValue!);
  const isMVP = slot.player ? mvpId === slot.player!.id : false;

  const clickAction = slot.player
    ? () => onPlayerClick(slot.player!.id)
    : onOpen;

  const {
    isDragging,
    dragPos,
    handlePointerDown,
    handlePointerMove,
    clearTimer,
    handleClick,
  } = useSlotDrag({
    slotId: slot.slotId,
    onSwap,
    onOpen: clickAction,
    disabled: isFromGeral,
  });

  if (slot.player) {
    return (
      <>
        <div
          data-slot-id={slot.slotId}
          className={`${Styles.slot_filled} swiper-no-swiping`}
          style={{ opacity: isDragging ? 0.3 : 1 }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={clearTimer}
          onPointerLeave={clearTimer}
          onClick={handleClick}
        >
          <PlayerDetails
            isFromGeral={isFromGeral}
            player={slot.player}
            backgroundColor={backgroundColor}
            stats={stats}
            isMVP={isMVP}
            onRemove={onRemove}
          />
        </div>

        {isDragging && (
          <div
            className={Styles.slot_filled}
            style={{
              position: "fixed",
              left: dragPos.x,
              top: dragPos.y,
              transform: "translate(-50%, -50%) scale(1.1)",
              pointerEvents: "none",
              zIndex: 9999,
              opacity: 0.9,
            }}
          >
            <PlayerDetails
              isFromGeral={isFromGeral}
              player={slot.player}
              backgroundColor={backgroundColor}
              stats={stats}
              isMVP={isMVP}
            />
          </div>
        )}
      </>
    );
  }

  if (isFromGeral && !slot.player) {
    return null;
  }

  return (
    <button
      data-slot-id={slot.slotId}
      className={`${Styles.slot_empty} ${isSelecting ? Styles.slot_active : ""} swiper-no-swiping`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearTimer}
      onPointerLeave={clearTimer}
      onClick={handleClick}
      type="button"
    >
      <span className={Styles.slot_plus}>+</span>
    </button>
  );
};
