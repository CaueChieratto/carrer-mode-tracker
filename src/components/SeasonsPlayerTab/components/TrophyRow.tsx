import { Players } from "../../../common/interfaces/playersInfo/players";
import CalculatedStatistics from "../../CalculatedStatistics";
import StatisticsTable_Title from "../../StatisticsTable_Title";
import Styles from "../SeasonsPlayerTab.module.css";
import { Trophy } from "../../../common/interfaces/club/trophy";
import LeagueStatsRow from "./LeagueStatsRow";
import { LeagueStats } from "../../../common/interfaces/playersStats/leagueStats";
import NoTitleSeason from "./NoTitleSeason";

type TrophyRowProps = {
  trophy?: Trophy;
  playerInSeason?: Players;
  seasonId: string;
  isExpanded: boolean;
  toggleExpand: (key: string) => void;
  leagueStats: LeagueStats;
};

const TrophyRow = ({
  trophy,
  playerInSeason,
  seasonId,
  isExpanded,
  toggleExpand,
  leagueStats,
}: TrophyRowProps) => {
  const trophyKey = `${seasonId}-${
    trophy?.leagueName ?? leagueStats.leagueName
  }`;
  const detailedLeagueStats = playerInSeason?.statsLeagues.find(
    (stats) => stats.leagueName === leagueStats.leagueName
  );

  return (
    <>
      <section
        className={Styles.section}
        onClick={() => toggleExpand(trophyKey)}
      >
        <StatisticsTable_Title
          isPlayer
          type="expand"
          leagueImage={detailedLeagueStats?.leagueImage}
          leagueName={leagueStats.leagueName}
          expand={isExpanded}
        />

        <CalculatedStatistics
          league
          isPlayer
          leagueStats={detailedLeagueStats}
        />
      </section>

      {isExpanded && (
        <>
          {trophy ? (
            <LeagueStatsRow
              leagueName={trophy.leagueName}
              leagueImage={trophy.leagueImage}
            />
          ) : (
            <NoTitleSeason leagueName={leagueStats.leagueName} />
          )}
        </>
      )}
    </>
  );
};

export default TrophyRow;
