import { FieldMarkings } from "./components/FieldMarkings";
import { LineupState } from "../../hooks/useLineup";
import { SlotButton } from "./components/SlotButton";
import Styles from "./Section.module.css";

type SectionProps = {
  lineup: LineupState;
  selectingSlotId: string | null;
  openPlayerPicker: (slotId: string) => void;
  removePlayer: (slotId: string) => void;
  swapPlayers: (idA: string, idB: string) => void;
  onPlayerClick: (playerId: string) => void;
};

export const Section = ({
  lineup,
  selectingSlotId,
  openPlayerPicker,
  removePlayer,
  swapPlayers,
  onPlayerClick,
}: SectionProps) => {
  const getGapSize = (playersCount: number) => {
    if (playersCount >= 5) return "14px";
    if (playersCount === 4) return "40px";
    if (playersCount === 3) return "65px";
    return "60px";
  };

  return (
    <div className={Styles.field_wrapper}>
      <div className={Styles.field}>
        <FieldMarkings />

        {[...lineup.lines].reverse().map((line, reversedIndex) => {
          const lineIndex = lineup.lines.length - 1 - reversedIndex;
          return (
            <div
              key={`line-${lineIndex}`}
              className={Styles.field_line}
              style={{ gap: getGapSize(line.length) }}
            >
              {line.map((slot) => (
                <div key={slot.slotId} className={Styles.field_slot}>
                  <SlotButton
                    slot={slot}
                    isSelecting={selectingSlotId === slot.slotId}
                    onOpen={() => openPlayerPicker(slot.slotId)}
                    onRemove={() => removePlayer(slot.slotId)}
                    onSwap={(targetId) => swapPlayers(slot.slotId, targetId)}
                    onPlayerClick={onPlayerClick}
                  />
                </div>
              ))}
            </div>
          );
        })}

        <div className={Styles.field_line}>
          <div className={Styles.field_slot}>
            <SlotButton
              slot={lineup.goalkeeper}
              isSelecting={selectingSlotId === "gk-0"}
              onOpen={() => openPlayerPicker("gk-0")}
              onRemove={() => removePlayer("gk-0")}
              onSwap={(targetId) => swapPlayers("gk-0", targetId)}
              onPlayerClick={onPlayerClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
