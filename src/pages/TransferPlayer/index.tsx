import { useNavigate, useParams } from "react-router-dom";
import { useSeasonData } from "../../common/hooks/Seasons/UseSeasonData";
import Load from "../../components/Load";
import Button from "../../components/Button";
import TransferPlayerContent from "./components/TransferPlayerContent";
import { SeasonThemeProvider } from "../../contexts/SeasonThemeContext";

const TransferPlayer = () => {
  const { careerId, seasonId, playerId } = useParams<{
    careerId: string;
    seasonId: string;
    playerId: string;
  }>();
  const { career, season, loading } = useSeasonData(careerId, seasonId);
  const navigate = useNavigate();

  const player = season?.players.find((p) => p.id === playerId);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <Load />;
  }

  if (!career || !season || !player) {
    return <Button onClick={handleGoBack}>Dados não encontrados.</Button>;
  }

  return (
    <SeasonThemeProvider careerId={careerId!} career={career}>
      <TransferPlayerContent
        handleGoBack={handleGoBack}
        career={career}
        season={season}
        careerId={career.id}
        player={player}
        currentPlayers={season.players}
      />
    </SeasonThemeProvider>
  );
};

export default TransferPlayer;
