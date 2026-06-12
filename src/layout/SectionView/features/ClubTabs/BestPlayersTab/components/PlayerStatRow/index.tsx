import { UseRatingColor } from "../../../../../../../common/hooks/Colors/GetOverallColor";
import { Players } from "../../../../../../../common/interfaces/playersInfo/players";
import { PlayerInfo } from "../../../../../../../components/PlayerInfo";
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
      <PlayerInfo
        name={player.name}
        position={player.position}
        shirtNumber={player.shirtNumber}
        age={player.age}
        nation={player.nation}
      />

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
