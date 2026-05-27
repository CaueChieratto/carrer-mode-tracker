import { UseRatingColor } from "../../../../../../../common/hooks/Colors/GetOverallColor";
import { Players } from "../../../../../../../common/interfaces/playersInfo/players";
import Styles from "./PlayerStatRow.module.css";

type PlayerStatRowProps = {
  player: Players;
  value: string | number;
  isRating?: boolean;
};

export const PlayerStatRow = ({
  player,
  value,
  isRating,
}: PlayerStatRowProps) => {
  const formattedValue =
    isRating && Number(value) % 1 === 0 ? Number(value).toString() : value;

  return (
    <section className={Styles.player}>
      <header className={Styles.player_info}>
        <div className={Styles.player_info_top}>
          <h2 className={Styles.data_title}>{player.name}</h2>
          <div className={Styles.data}>{player.position}</div>
          <div className={Styles.data}>{player.shirtNumber}</div>
        </div>
        <div className={Styles.player_info_bottom}>
          <h2 className={Styles.data}>{player.age} anos</h2>
          <div className={Styles.data}>{player.nation}</div>
        </div>
      </header>

      <footer className={Styles.stat_block}>
        {isRating ? (
          <div
            className={Styles.ratingBadge}
            style={{ backgroundColor: UseRatingColor(+value) }}
          >
            {formattedValue}
          </div>
        ) : (
          <h3 className={Styles.data_title_stat}>{value}</h3>
        )}
      </footer>
    </section>
  );
};
