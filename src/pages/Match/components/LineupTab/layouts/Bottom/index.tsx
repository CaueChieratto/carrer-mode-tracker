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
};

export const Bottom = ({
  lineup,
  selectingSlotId,
  openPlayerPicker,
  removePlayer,
}: BottomProps) => {
  const { filledSlots, firstEmptySlot } = getBenchSlots(lineup);

  return (
    <div className={Styles.container}>
      <h3 className={Styles.title}>{UI_TEXT.title}</h3>

      <div className={Styles.list}>
        {filledSlots.map((slot) => (
          <PlayerRow key={slot.slotId} slot={slot} onRemove={removePlayer} />
        ))}

        {firstEmptySlot && (
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
