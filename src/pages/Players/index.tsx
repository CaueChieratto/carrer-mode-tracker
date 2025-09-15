import Load from "../../components/Load";
import SectionView from "../../components/SectionView";
import NotFoundDisplay from "../../components/NotFoundDisplay";
import { useSeasonView } from "../../common/hooks/Seasons/UseSeasonView";
import { useParams } from "react-router-dom";

const Player = () => {
  const { loading, career, season, tabsConfig } = useSeasonView(true, true);
  const { playerId } = useParams<{ playerId: string }>();
  if (loading) return <Load />;
  if (!career || !season) return <NotFoundDisplay />;

  const player = season.players.find((p) => p.id === playerId);

  const seasonsPlayerPlayed = career.clubData.filter((s) =>
    s.players.some((p) => p.id === playerId && !p.sell)
  ).length;

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
