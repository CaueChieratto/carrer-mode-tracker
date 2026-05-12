import { ClubData } from "../../../../common/interfaces/club/clubData";
import Card from "../../../../ui/Card";
import { Match } from "../../types/Match";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";
import { Career } from "../../../../common/interfaces/Career";
import { useMatchNavigation } from "./hooks/useMatchNavigation";
import { buildMatchCopyText } from "./helpers/buildCopyText";
import { Copy } from "../../../../common/utils/Copy";

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

  const copyText = async () => {
    const text = buildMatchCopyText({ match, career });

    await Copy(text, "Copiado!");
  };

  return (
    <Card className={Styles.card}>
      <MatchHeader
        leagueName={match.league}
        leagueData={leagueData}
        onEdit={goToEdit}
        isGeralPage={isGeralPage}
        match={match}
        onClick={copyText}
      />

      <MatchBody match={match} onClick={goToMatch} />
    </Card>
  );
};
