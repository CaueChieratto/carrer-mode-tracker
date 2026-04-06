import { LineupSlot } from "../../hooks/useLineup";
import Styles from "./SlotButton.module.css";

type SlotButtonProps = {
  slot: LineupSlot;
  isSelecting: boolean;
  onOpen: () => void;
  onRemove: () => void;
};

export const SlotButton = ({
  slot,
  isSelecting,
  onOpen,
  onRemove,
}: SlotButtonProps) => {
  if (slot.player) {
    return (
      <div className={Styles.slot_filled}>
        <button className={Styles.slot_remove} onClick={onRemove} type="button">
          ×
        </button>
        <span className={Styles.slot_name}>{slot.player.name}</span>
        <span className={Styles.slot_overall}>{slot.player.overall}</span>
      </div>
    );
  }

  return (
    <button
      className={`${Styles.slot_empty} ${isSelecting ? Styles.slot_active : ""}`}
      onClick={onOpen}
      type="button"
    >
      <span className={Styles.slot_plus}>+</span>
    </button>
  );
};
