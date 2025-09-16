import { Trophy } from "../../../../common/interfaces/club/trophy";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { LeagueStats } from "../../../../common/interfaces/playersStats/leagueStats";
import CalculatedStatistics from "../../../CalculatedStatistics";
import StatisticsTable_Title from "../../../StatisticsTable_Title";
import NoTitleSeason from "../../components/NoTitleSeason";
import LeagueStatsRow from "../../SeasonsPlayerTab/components/LeagueStatsRow";
import Styles from "../../SeasonsPlayerTab/SeasonsPlayerTab.module.css";

type LeagueStatsRowTotalProps = {
  leagueStats: LeagueStats;
  isExpanded: boolean;
  toggleExpand: (leagueName: string) => void;
  trophy?: Trophy;
  player?: Players;
};

const LeagueStatsRowTotal = ({
  leagueStats,
  isExpanded,
  toggleExpand,
  trophy,
  player,
}: LeagueStatsRowTotalProps) => {
  const isGoalkeeper = player?.position === "GOL";

  return (
    <>
      <section
        className={Styles.section}
        onClick={() => toggleExpand(leagueStats.leagueName)}
      >
        <StatisticsTable_Title
          isPlayer
          type="expand"
          leagueImage={leagueStats.leagueImage}
          expand={isExpanded}
        />
        <CalculatedStatistics
          league
          isPlayer
          leagueStats={leagueStats}
          isGoalkeeper={isGoalkeeper}
        />
      </section>
      {isExpanded && (
        <>
          {trophy ? (
            <LeagueStatsRow
              isTotal
              leagueName={trophy.leagueName}
              leagueImage={trophy.leagueImage}
              trophy={trophy}
            />
          ) : (
            <NoTitleSeason
              text="Não ganhou a"
              leagueName={leagueStats.leagueName}
            />
          )}
        </>
      )}
    </>
  );
};

export default LeagueStatsRowTotal;
