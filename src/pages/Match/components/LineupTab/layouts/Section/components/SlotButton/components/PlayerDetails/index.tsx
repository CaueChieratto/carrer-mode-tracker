import { GiSoccerBall } from "react-icons/gi";
import { Players } from "../../../../../../../../../../common/interfaces/playersInfo/players";
import Styles from "./PlayerDetails.module.css";
import { Boot } from "../../../../../../../../../../ui/IconsSVG/Boot";
import { RefereeCard } from "../../../../../../../../../../ui/IconsSVG/RefereeCard";
import { Sub } from "../../../../../../../../../../ui/IconsSVG/Sub";
import { MVP } from "../../../../../../../../../../ui/IconsSVG/MVP";

type PlayerDetailsProps = {
  player: Players;
  backgroundColor: string;
  onRemove?: () => void;
};

export const PlayerDetails = ({
  player,
  backgroundColor,
  onRemove,
}: PlayerDetailsProps) => (
  <>
    <div className={Styles.container}>
      <div className={Styles.container_stats}>
        <Sub className={Styles.subs} />
        <RefereeCard
          className={Styles.referee_card}
          type="yellow"
          // type="second-yellow"
          // type="red"
        />
      </div>
      <button
        className={Styles.slot_remove}
        onClick={(e) => {
          e.stopPropagation();
          onRemove!();
        }}
        type="button"
      >
        ×
      </button>
    </div>
    <div className={Styles.slot_label}>
      <span className={Styles.slot_shirt_number}>{player.shirtNumber}</span>
      <span className={Styles.slot_name}>{player.name}</span>
    </div>
    <div className={Styles.wrapper}>
      <span className={Styles.stats}>
        <GiSoccerBall size={16} />
      </span>
      <span className={Styles.container_rating}>
        <span className={Styles.rating} style={{ backgroundColor }}>
          7.3
        </span>
        <p className={`${Styles.stats} ${Styles.mvp}`}>
          <MVP />
        </p>
      </span>
      <span className={Styles.stats}>
        <Boot />
      </span>
    </div>
  </>
);
