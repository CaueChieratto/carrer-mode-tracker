import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { PlayerMatchStat } from "../../../../../../components/AllMatchesTab/types/PlayerMatchStat";
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
        {filledSlots.map((slot) => {
          const stats = slot.player
            ? playerStats.find((s) => s.playerId === slot.player!.id)
            : undefined;
          const isMVP = slot.player ? mvpId === slot.player!.id : false;

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
