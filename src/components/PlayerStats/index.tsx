// src/components/PlayerStats/index.tsx

import Card from "../../ui/Card";
import Styles from "./PlayerStats.module.css";
import StatisticsTable_Title from "../StatisticsTable_Title";
import { useRef, useState } from "react";
import { Players } from "../../common/interfaces/playersInfo/players";
import { useNavigate, useParams } from "react-router-dom";
import CalculatedStatistics from "../CalculatedStatistics";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData";
import { usePlayerSeasonStats } from "../../common/hooks/Players/UsePlayerSeasonStats";
import Load from "../Load";
import { Career } from "../../common/interfaces/Career";
import { ClubData } from "../../common/interfaces/club/clubData";

type PlayerStatsProps = {
  player: Players;
};

type PlayerStatsContentProps = {
  career: Career;
  season: ClubData;
  player: Players;
};

const PlayerStatsContent = ({
  career,
  season,
  player,
}: PlayerStatsContentProps) => {
  const [expand, setExpand] = useState(false);
  const isGoalkeeper = player.position === "GOL";
  const navigate = useNavigate();
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

  const handleNavigateToEdit = () => {
    navigate(
      `/Career/${careerId}/Season/${seasonId}/EditPlayer/${player.id}?from=stats`
    );
  };

  return (
    <Card className={Styles.card}>
      <section className={Styles.section} onClick={handleNavigateToEdit}>
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
      <section className={Styles.section} onClick={() => setExpand(!expand)}>
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
          {player.statsLeagues.map((league) => (
            <section className={Styles.section_leagues} key={league.leagueName}>
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

const PlayerStats = ({ player }: PlayerStatsProps) => {
  const { careerId, seasonId } = useParams<{
    careerId: string;
    seasonId: string;
  }>();
  const { career, season, loading } = useSeasonData(careerId, seasonId);

  if (loading || !career || !season) {
    return <Load />;
  }

  return <PlayerStatsContent career={career} season={season} player={player} />;
};

export default PlayerStats;
