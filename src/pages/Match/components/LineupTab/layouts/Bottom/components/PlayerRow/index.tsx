import { GiSoccerBall } from "react-icons/gi";
import { UseRatingColor } from "../../../../../../../../common/hooks/Colors/GetOverallColor";
import { Boot } from "../../../../../../../../ui/IconsSVG/Boot";
import { MVP } from "../../../../../../../../ui/IconsSVG/MVP";
import { RefereeCard } from "../../../../../../../../ui/IconsSVG/RefereeCard";
import { Sub } from "../../../../../../../../ui/IconsSVG/Sub";
import { UI_TEXT } from "../../constants/uiText";
import { BenchSlot } from "../../helpers/getBenchSlots";
import Styles from "./PlayerRow.module.css";
import { Row } from "../Row";

type PlayerRowProps = {
  slot: BenchSlot;
  onRemove: (slotId: string) => void;
};

const STATIC_RATING = 8.2;

export const PlayerRow = ({ slot, onRemove }: PlayerRowProps) => {
  if (!slot.player) return null;

  const backgroundColor = UseRatingColor(STATIC_RATING);

  const handleRemove = () => onRemove(slot.slotId);

  return (
    <Row>
      <div className={Styles.player_info}>
        <div className={Styles.player_name_row}>
          <span className={Styles.shirt_number}>{slot.player.shirtNumber}</span>

          <span className={Styles.player_name}>{slot.player.name}</span>

          <span className={Styles.icon_wrapper}>
            <GiSoccerBall size={14} />
          </span>

          <span className={Styles.icon_wrapper}>
            <Boot />
          </span>

          <span className={Styles.icon_wrapper}>
            <RefereeCard type="yellow" className={Styles.referee_card} />
          </span>

          <span className={Styles.icon_wrapper}>
            <MVP />
          </span>
        </div>

        <div className={Styles.player_sub_row}>
          <span className={Styles.sub_icon_wrapper}>
            <Sub className={Styles.sub_icon} />
          </span>

          <span className={Styles.sub_minute}>46'</span>
          <span className={Styles.sub_out}>Saiu: L. Yamal</span>
        </div>
      </div>

      <div className={Styles.rating} style={{ backgroundColor }}>
        {STATIC_RATING}
      </div>

      <button
        className={Styles.remove_button}
        onClick={handleRemove}
        type="button"
        title={UI_TEXT.removePlayer}
      >
        ✕
      </button>
    </Row>
  );
};
