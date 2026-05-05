import { ClubData } from "../../../../common/interfaces/club/clubData";
import Card from "../../../../ui/Card";
import { Match } from "../../types/Match";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";
import { Career } from "../../../../common/interfaces/Career";
import { useMatchNavigation } from "./hooks/useMatchNavigation";
import { buildMatchCopyText } from "./helpers/buildCopyText";
import { CgCopy } from "react-icons/cg";

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

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert("Copiado!");
      } else {
        throw new Error("Clipboard indisponível");
      }
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Copiado!");
      } catch (err) {
        console.error("Erro ao copiar texto no fallback:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <Card className={Styles.card}>
      {match.status === "FINISHED" && (
        <div className={Styles.icon} onClick={copyText}>
          <CgCopy />
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
