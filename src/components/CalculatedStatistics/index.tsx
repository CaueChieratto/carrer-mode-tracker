import { LeagueStats } from "../../common/interfaces/playersStats/leagueStats";
import { Players } from "../../common/interfaces/playersInfo/players";
import Statistic from "../../ui/Statistic";
import { useStatistics } from "../../common/hooks/Stats/UseStatistics";
import { iconMap } from "../../common/constants/StatsIconMap";

type CalculatedStatisticsProps = {
  info?: boolean;
  total?: boolean;
  league?: boolean;
  isGoalkeeper?: boolean;
  player?: Players;
  leagueStats?: LeagueStats;
  handleDeleteLeague?: (leagueName: string) => void;
};

const CalculatedStatistics = (props: CalculatedStatisticsProps) => {
  const { filteredStats } = useStatistics(props);

  return (
    <>
      {filteredStats.map((stat, index) => (
        <Statistic
          key={index}
          label={stat.label}
          icon={!stat.showOnlyForLeague ? iconMap[stat.label] : undefined}
          deleteIcon={stat.showOnlyForLeague ? iconMap[stat.label] : undefined}
          value={"getValue" in stat ? stat.getValue?.() : undefined}
          isLeague={props.league}
          isInfo={props.info}
          getColor={stat.getColor}
          className={stat.className}
          onClick={stat.onClick}
        />
      ))}
    </>
  );
};

export default CalculatedStatistics;
