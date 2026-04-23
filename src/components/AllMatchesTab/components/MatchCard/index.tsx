import { useParams, useNavigate } from "react-router-dom";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import Card from "../../../../ui/Card";
import { Match } from "../../types/Match";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";

type MatchCardProps = {
  match: Match;
  season: ClubData;
  isGeralPage: boolean;
};

export const MatchCard = ({ match, season, isGeralPage }: MatchCardProps) => {
  const leagueData = season.leagues?.find((l) => l.name === match.league);

  const { careerId, seasonId } = useParams();
  const navigate = useNavigate();

  const currentSeasonId = seasonId || season.id;

  const editMatch = () => {
    const baseUrl = `/Career/${careerId}/Season/${currentSeasonId}/AddMatches/${match.matchesId}`;
    navigate(isGeralPage ? `${baseUrl}?fromGeral=true` : baseUrl);
  };

  const openMatch = () => {
    const baseUrl = `/Career/${careerId}/Season/${currentSeasonId}/Match/${match.matchesId}`;
    navigate(isGeralPage ? `${baseUrl}?fromGeral=true` : baseUrl);
  };

  return (
    <Card className={Styles.card}>
      <MatchHeader
        leagueName={match.league}
        leagueData={leagueData}
        onEdit={editMatch}
        isGeralPage={isGeralPage}
      />
      <MatchBody match={match} onClick={openMatch} />
    </Card>
  );
};
