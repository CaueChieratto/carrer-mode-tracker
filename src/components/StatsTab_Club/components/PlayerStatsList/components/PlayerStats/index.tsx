import Card from "../../../../../../ui/Card";
import Styles from "./PlayerStats.module.css";
import StatisticsTable_Title from "../../../../../Statistics/StatisticsTable_Title";
import { useMemo, useRef, useState } from "react";
import { Players } from "../../../../../../common/interfaces/playersInfo/players";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePlayerSeasonStats } from "../../../../../../common/hooks/Players/UsePlayerSeasonStats";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { sortLeaguesByLevel } from "../../../../../../common/utils/Sorts";
import CalculatedStatistics from "../../../../../Statistics/CalculatedStatistics";

type PlayerStatsProps = {
  player: Players;
  career: Career;
  season: ClubData;
  isGeralPage: boolean;
};

const PlayerStats = ({
  career,
  season,
  player,
  isGeralPage,
}: PlayerStatsProps) => {
  const [expand, setExpand] = useState(false);
  const isGoalkeeper = player.position === "GOL";
  const navigate = useNavigate();
  const location = useLocation();
  const { careerId, seasonId } = useParams<{
    careerId: string;
    seasonId: string;
  }>();
  const leagueFormRef = useRef(null);

  const { handleDeleteLeague } = usePlayerSeasonStats({
    career,
    season,
    player,
    leagueFormRef,
  });

  const sortedLeagues = useMemo(
    () => sortLeaguesByLevel(player.statsLeagues),
    [player.statsLeagues],
  );

  const navigatePlayer = () => {
    if (location.pathname.includes("/Geral")) {
      navigate(`/Career/${careerId}/Geral/Player/${player.id}`);
    } else {
      navigate(
        `/Career/${careerId}/Season/${seasonId}/EditPlayer/${player.id}?from=stats`,
      );
    }
  };

  return (
    <Card className={Styles.card}>
      <section
        className={isGeralPage ? Styles.section_geral : Styles.section}
        onClick={navigatePlayer}
      >
        <StatisticsTable_Title
          type="info"
          playerName={player.name}
          overall={player.overall}
        />
        <CalculatedStatistics
          info
          total
          isGoalkeeper={isGoalkeeper}
          player={player}
        />
      </section>
      <section
        className={isGeralPage ? Styles.section_geral : Styles.section}
        onClick={() => setExpand(!expand)}
      >
        <StatisticsTable_Title
          setExpand={setExpand}
          expand={expand}
          type="expand"
        />
        <CalculatedStatistics
          total
          player={player}
          isGoalkeeper={isGoalkeeper}
        />
      </section>
      {expand && (
        <>
          {sortedLeagues.map((league) => (
            <section
              className={
                isGeralPage
                  ? Styles.section_leagues_geral
                  : Styles.section_leagues
              }
              key={league.leagueName}
            >
              <StatisticsTable_Title
                type="league"
                leagueName={league.leagueName}
                leagueImage={league.leagueImage}
              />
              <CalculatedStatistics
                league
                leagueStats={league}
                isGoalkeeper={isGoalkeeper}
                handleDeleteLeague={handleDeleteLeague}
              />
            </section>
          ))}
        </>
      )}
    </Card>
  );
};

export default PlayerStats;
