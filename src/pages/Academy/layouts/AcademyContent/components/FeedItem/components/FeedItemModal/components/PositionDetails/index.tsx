import { FaArrowRight, FaMapSigns } from "react-icons/fa";
import { FeedEvent } from "../../../../types/FeedEvent";
import Styles from "./PositionDetails.module.css";

type PositionDetailsProps = {
  details: NonNullable<FeedEvent["details"]>;
  modalText: string;
};

export const PositionDetails = ({
  details,
  modalText,
}: PositionDetailsProps) => {
  return (
    <div className={Styles.socialCard}>
      <div className={Styles.statTypeTag}>NOVA POSIÇÃO</div>
      <FaMapSigns className={Styles.positionIcon} />

      <div className={Styles.evolutionRow}>
        <span className={Styles.oldPosition}>{details.oldValue}</span>
        <FaArrowRight className={Styles.socialArrow} />
        <span className={Styles.newPosition}>{details.newValue}</span>
      </div>

      <div className={Styles.socialDesc}>{modalText}</div>
    </div>
  );
};
