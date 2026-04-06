import { useParams } from "react-router-dom";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import Card from "../../../../ui/Card";
import { Match } from "../../types/Match";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";

type MatchCardProps = {
  match: Match;
  season: ClubData;
};

export const MatchCard = ({ match, season }: MatchCardProps) => {
  const leagueData = season.leagues?.find((l) => l.name === match.league);

  const { careerId, seasonId } = useParams();

  const editMatch = () => {
    window.location.href = `/Career/${careerId}/Season/${seasonId}/AddMatches/${match.matchesId}`;
  };

  const openMatch = () => {
    window.location.href = `/Career/${careerId}/Season/${seasonId}/Match/${match.matchesId}`;
  };

  return (
    <Card className={Styles.card}>
      <MatchHeader
        leagueName={match.league}
        leagueData={leagueData}
        onEdit={editMatch}
      />
      <MatchBody match={match} onClick={openMatch} />
    </Card>
  );
};
