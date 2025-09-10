import { useSearchParams, useParams } from "react-router-dom";
import { useSeasons } from "../../common/hooks/Seasons/UseSeasons";
import Button from "../../components/Button";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData";
import Load from "../../components/Load";
import AddPlayersContent from "../../components/AddPlayersContent";

const AddPlayers = () => {
  const [searchParams] = useSearchParams();
  const { careerId, seasonId, playerId } = useParams<{
    careerId: string;
    seasonId: string;
    playerId: string;
  }>();

  const { career, season, loading } = useSeasonData(careerId, seasonId);
  const { handleNavigateToSeason } = useSeasons(careerId!);
  const origin = searchParams.get("from");

  const player = season?.players.find((p) => p.id === playerId);

  const handleGoBack = () => {
    if (seasonId) {
      handleNavigateToSeason(seasonId);
    }
  };

  if (loading) {
    return <Load />;
  }

  if (!career) {
    return <Button onClick={handleGoBack}>Carreira não encontrada.</Button>;
  }

  return (
    <SeasonThemeProvider careerId={careerId!} career={career}>
      <AddPlayersContent
        origin={origin}
        handleGoBack={handleGoBack}
        career={career}
        season={season!}
        careerId={career.id}
        player={player}
        playerName={player?.name}
        currentPlayers={season?.players}
      />
    </SeasonThemeProvider>
  );
};

export default AddPlayers;
