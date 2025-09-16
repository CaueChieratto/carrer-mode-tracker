import { useState } from "react";
import { Career } from "../../../common/interfaces/Career";
import { Players } from "../../../common/interfaces/playersInfo/players";
import Card from "../../../ui/Card";
import SeasonRow from "../components/SeasonRow";
import SeasonTotalStats from "../components/SeasonTotalStats";
import LeagueStatsRowTotal from "./components/LeagueStatsRowTotal";
import { useAggregatedLeagueStats } from "./hooks/useAggregatedLeagueStats";
import { useTotalPlayerTab } from "./hooks/useTotalPlayerTab";
import Styles from "./TotalPlayerTab.module.css";

type TotalPlayerTabProps = {
  player?: Players;
  career: Career;
};

const TotalPlayerTab = ({ player, career }: TotalPlayerTabProps) => {
  const { allTrophiesWon } = useTotalPlayerTab(career, player);
  const { aggregatedLeagueStats } = useAggregatedLeagueStats(career, player);
  const [expand, setExpand] = useState<Record<string, boolean>>({});

  const toggleExpand = (leagueName: string) => {
    setExpand((prev) => ({
      ...prev,
      [leagueName]: !prev[leagueName],
    }));
  };

  return (
    <>
      <Card className={Styles.card}>
        <SeasonRow seasonString="Total por Liga" player={player} />
        {aggregatedLeagueStats.map((league) => {
          const trophy = allTrophiesWon.find(
            (t) => t.leagueName === league.leagueName
          );

          return (
            <LeagueStatsRowTotal
              key={league.leagueName}
              leagueStats={league}
              isExpanded={!!expand[league.leagueName]}
              toggleExpand={toggleExpand}
              trophy={trophy}
              player={player}
            />
          );
        })}
      </Card>
      <Card className={Styles.card}>
        <SeasonRow seasonString="Total" player={player} />
        <SeasonTotalStats
          isTotal
          playerInSeason={player}
          trophiesWonInSeason={allTrophiesWon}
        />
      </Card>
    </>
  );
};

export default TotalPlayerTab;
