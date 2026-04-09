import { UseRatingColor } from "../../../../../../../../common/hooks/Colors/GetOverallColor";
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
};

export const SlotButton = ({
  slot,
  isSelecting,
  onOpen,
  onRemove,
  onSwap,
  onPlayerClick,
}: SlotButtonProps) => {
  const backgroundColor = UseRatingColor(7.3);

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
  } = useSlotDrag({ slotId: slot.slotId, onSwap, onOpen: clickAction });

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
            player={slot.player}
            backgroundColor={backgroundColor}
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
              player={slot.player}
              backgroundColor={backgroundColor}
            />
          </div>
        )}
      </>
    );
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
