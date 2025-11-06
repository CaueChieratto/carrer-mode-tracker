import Load from "../../components/Load";
import SectionView from "../../components/SectionView";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { useParams } from "react-router-dom";
import { calculateTotalStats } from "../../common/utils/PlayerStatsCalculator";

const Player = () => {
  const { loading, career, season, tabsConfig } = useSeasonView(true, true);
  const { playerId } = useParams<{ playerId: string }>();
  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  const player = season.players.find((p) => p.id === playerId);

  const seasonsPlayerPlayed = career.clubData.filter((s) => {
    const playerInSeason = s.players.find((p) => p.id === playerId);

    if (!playerInSeason) return false;

    const totalStats = calculateTotalStats(playerInSeason);

    return (
      totalStats.games > 0 ||
      totalStats.goals > 0 ||
      totalStats.assists > 0 ||
      totalStats.cleanSheets > 0
    );
  }).length;

  const titleText = `${seasonsPlayerPlayed} ${
    seasonsPlayerPlayed === 1 ? "Temporada" : "Temporadas"
  } no clube`;

  return (
    <SectionView
      isPlayer
      notSeason
      player={player}
      title={titleText}
      career={career}
      season={season}
      tabsConfig={tabsConfig}
    />
  );
};

export default Player;
