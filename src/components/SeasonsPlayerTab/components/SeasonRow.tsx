import { Players } from "../../../common/interfaces/playersInfo/players";
import CalculatedStatistics from "../../CalculatedStatistics";
import StatisticsTable_Title from "../../StatisticsTable_Title";
import Styles from "../SeasonsPlayerTab.module.css";

type SeasonRowProps = {
  seasonString: string;
  player?: Players;
};

const SeasonRow = ({ seasonString, player }: SeasonRowProps) => (
  <section className={Styles.section}>
    <StatisticsTable_Title isPlayer type="info" playerName={seasonString} />
    <CalculatedStatistics info total isPlayer player={player} />
  </section>
);

export default SeasonRow;
