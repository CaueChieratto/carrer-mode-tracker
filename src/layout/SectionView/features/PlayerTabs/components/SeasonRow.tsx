import { Players } from "../../../../../common/interfaces/playersInfo/players";
import CalculatedStatistics from "../../../../../components/Statistics/CalculatedStatistics";
import StatisticsTable_Title from "../../../../../components/Statistics/StatisticsTable_Title";
import Styles from "../SeasonsPlayerTab/SeasonsPlayerTab.module.css";
import { BsCopy } from "react-icons/bs";

type SeasonRowProps = {
  seasonString: string;
  player?: Players;
  onClickCopy?: () => void;
};

const SeasonRow = ({ seasonString, player, onClickCopy }: SeasonRowProps) => {
  const isGoalkeeper = player?.position === "GOL";

  return (
    <section className={Styles.section}>
      <div className={Styles.copy} onClick={onClickCopy}>
        <BsCopy size={25} />
      </div>
      <StatisticsTable_Title isPlayer type="info" playerName={seasonString} />
      <CalculatedStatistics
        info
        total
        isPlayer
        player={player}
        isGoalkeeper={isGoalkeeper}
      />
    </section>
  );
};

export default SeasonRow;
