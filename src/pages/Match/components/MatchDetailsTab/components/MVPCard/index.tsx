import { FaStar } from "react-icons/fa";
import Styles from "./MVPCard.module.css";
import { CardDetails } from "../../../../../../ui/IconsSVG/CardDetails";

type MVPCardProps = {
  playerName: string;
  rating: number;
};

export const MVPCard = ({ playerName, rating }: MVPCardProps) => {
  return (
    <div className={Styles.mvp_card}>
      <CardDetails className={Styles.card_details_left} type="left" />
      <div className={Styles.mvp_header}>
        <div className={Styles.mvp_icon_wrapper}>
          <FaStar color="#fff" size={12} />
        </div>
        <span className={Styles.mvp_title}>Jogador da partida</span>
      </div>

      <div className={Styles.mvp_content}>
        <div className={Styles.mvp_info}>
          <span className={Styles.mvp_name}>{playerName}</span>
        </div>
        <div className={Styles.mvp_rating}>{rating}</div>
      </div>
      <CardDetails className={Styles.card_details_right} type="right" />
    </div>
  );
};
