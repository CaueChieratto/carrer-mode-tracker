import { ClubData } from "../../../../../../../common/interfaces/club/clubData";
import Card from "../../../../../../../ui/Card";
import { Match } from "../../types/Match";
import { PlayerMatchStat } from "../../types/PlayerMatchStat";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";
import { Career } from "../../../../../../../common/interfaces/Career";
import { useMatchNavigation } from "./hooks/useMatchNavigation";
import { buildMatchCopyText } from "./helpers/buildCopyText";
import { Copy } from "../../../../../../../common/utils/Copy";

type MatchCardProps = {
  career: Career;
  match: Match;
  season: ClubData;
  isGeralPage: boolean;
  onAddBadge?: (teamName: string) => void;
  playerStat?: PlayerMatchStat;
};

export const MatchCard = ({
  career,
  match,
  season,
  isGeralPage,
  onAddBadge,
  playerStat,
}: MatchCardProps) => {
  const teams = season.teams || [];

  const leagueData = season.leagues?.find((l) => l.name === match.league);

  const { goToEdit, goToMatch } = useMatchNavigation({
    seasonId: season.id,
    matchId: match.matchesId,
    isGeralPage,
    playerId: playerStat?.playerId,
  });

  const copyText = async () => {
    const text = buildMatchCopyText({ match, career });
    await Copy(text, "Copiado!");
  };

  const isHomeCareerTeam = match.homeTeam === career.clubName;
  const homeTeamData = teams.find((team) => team.name === match.homeTeam);
  const awayTeamData = teams.find((team) => team.name === match.awayTeam);

  const homeBadge = isHomeCareerTeam
    ? career.teamBadge
    : homeTeamData?.badge || "";

  const awayBadge = !isHomeCareerTeam
    ? career.teamBadge
    : awayTeamData?.badge || "";

  return (
    <>
      <Card className={Styles.card}>
        <MatchHeader
          leagueName={match.league}
          leagueData={leagueData}
          onEdit={goToEdit}
          isGeralPage={isGeralPage}
          match={match}
          onClick={copyText}
        />

        <MatchBody
          match={match}
          onClick={goToMatch}
          homeBadge={homeBadge}
          awayBadge={awayBadge}
          onAddBadge={onAddBadge}
          playerStat={playerStat}
          isHomeCareerTeam={isHomeCareerTeam}
        />
      </Card>
    </>
  );
};
