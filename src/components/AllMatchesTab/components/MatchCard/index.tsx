import { ClubData } from "../../../../common/interfaces/club/clubData";
import Card from "../../../../ui/Card";
import { Match } from "../../types/Match";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";
import { FaRegCopy } from "react-icons/fa6";
import { Career } from "../../../../common/interfaces/Career";
import { useMatchNavigation } from "./hooks/useMatchNavigation";
import { buildMatchCopyText } from "../../../../common/helpers/buildCopyText";

type MatchCardProps = {
  career: Career;
  match: Match;
  season: ClubData;
  isGeralPage: boolean;
};

export const MatchCard = ({
  career,
  match,
  season,
  isGeralPage,
}: MatchCardProps) => {
  const leagueData = season.leagues?.find((l) => l.name === match.league);

  const { goToEdit, goToMatch } = useMatchNavigation({
    seasonId: season.id,
    matchId: match.matchesId,
    isGeralPage,
  });

  const copyText = () => {
    const text = buildMatchCopyText({ match, career });
    navigator.clipboard.writeText(text);
    alert("Copiado!");
  };

  return (
    <Card className={Styles.card}>
      {match.status === "FINISHED" && (
        <div className={Styles.icon} onClick={copyText}>
          <FaRegCopy />
        </div>
      )}

      <MatchHeader
        leagueName={match.league}
        leagueData={leagueData}
        onEdit={goToEdit}
        isGeralPage={isGeralPage}
      />

      <MatchBody match={match} onClick={goToMatch} />
    </Card>
  );
};
