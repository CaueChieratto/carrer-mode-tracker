import { GiSoccerBall } from "react-icons/gi";
import { Players } from "../../../../../../../../../../common/interfaces/playersInfo/players";
import Styles from "./PlayerDetails.module.css";
import { Boot } from "../../../../../../../../../../ui/IconsSVG/Boot";
import { RefereeCard } from "../../../../../../../../../../ui/IconsSVG/RefereeCard";
import { Sub } from "../../../../../../../../../../ui/IconsSVG/Sub";
import { MVP } from "../../../../../../../../../../ui/IconsSVG/MVP";
import { PlayerMatchStat } from "../../../../../../../../../../components/AllMatchesTab/types/PlayerMatchStat";
import { NumberStats } from "../../../../../../../../ui/NumberStats";

type PlayerDetailsProps = {
  player: Players;
  backgroundColor: string;
  stats?: PlayerMatchStat;
  isMVP?: boolean;
  onRemove?: () => void;
};

export const PlayerDetails = ({
  player,
  backgroundColor,
  onRemove,
  isMVP,
  stats,
}: PlayerDetailsProps) => (
  <>
    <div className={Styles.container}>
      <div className={Styles.container_stats}>
        {stats?.substituteIn && stats.substituteIn !== "Nenhum" && (
          <Sub className={Styles.subs} />
        )}

        {stats?.redCard && stats?.yellowCard ? (
          <RefereeCard className={Styles.referee_card} type="second-yellow" />
        ) : stats?.redCard ? (
          <RefereeCard className={Styles.referee_card} type="red" />
        ) : stats?.yellowCard ? (
          <RefereeCard className={Styles.referee_card} type="yellow" />
        ) : null}
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
      <div className={Styles.container_rating}>
        {stats && stats.goals > 0 && (
          <>
            <span className={Styles.stats}>
              <GiSoccerBall size={16} />
            </span>
            {stats && stats.goals > 1 && (
              <NumberStats type="goals">{stats.goals}</NumberStats>
            )}
          </>
        )}
      </div>

      <div className={Styles.container_rating}>
        {stats?.rating != null && stats.rating > 0 && (
          <span className={Styles.rating} style={{ backgroundColor }}>
            {stats.rating.toFixed(1)}
          </span>
        )}

        {isMVP && (
          <p className={`${Styles.stats} ${Styles.mvp}`}>
            <MVP />
          </p>
        )}
      </div>

      <div className={Styles.container_rating}>
        {stats && stats.assists > 0 && (
          <>
            <span className={Styles.stats}>
              <Boot />
            </span>
            {stats && stats.assists > 1 && (
              <NumberStats type="assist">{stats.assists}</NumberStats>
            )}
          </>
        )}
      </div>
    </div>
  </>
);
