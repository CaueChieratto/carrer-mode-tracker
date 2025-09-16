import { Players } from "../../../common/interfaces/playersInfo/players";
import Styles from "../SeasonsPlayerTab.module.css";
import { FcCalculator } from "react-icons/fc";
import CalculatedStatistics from "../../CalculatedStatistics";
import { useState } from "react";
import { Trophy } from "../../../common/interfaces/club/trophy";
import StatisticsTable_Title from "../../StatisticsTable_Title";
import TrophyList from "./TrophyList";

type SeasonTotalStatsProps = {
  playerInSeason?: Players;
  trophiesWonInSeason: Trophy[];
};

const SeasonTotalStats = ({
  playerInSeason,
  trophiesWonInSeason,
}: SeasonTotalStatsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!playerInSeason) {
    return null;
  }

  const isGoalkeeper = playerInSeason.position === "GOL";

  return (
    <>
      <section
        className={Styles.section}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <StatisticsTable_Title
          isPlayer
          type="expand"
          icon={<FcCalculator size={28} />}
          expand={isExpanded}
        />
        <CalculatedStatistics
          total
          isPlayer
          player={playerInSeason}
          isGoalkeeper={isGoalkeeper}
        />
      </section>
      {isExpanded && <TrophyList trophies={trophiesWonInSeason} />}
    </>
  );
};

export default SeasonTotalStats;
