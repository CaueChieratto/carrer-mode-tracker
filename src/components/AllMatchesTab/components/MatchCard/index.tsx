import { useParams, useNavigate } from "react-router-dom";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import Card from "../../../../ui/Card";
import { Match } from "../../types/Match";
import Styles from "./MatchCard.module.css";
import { MatchBody } from "./components/MatchBody";
import { MatchHeader } from "./components/MatchHeader";
import { FaRegCopy } from "react-icons/fa6";
import { Career } from "../../../../common/interfaces/Career";

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

  const buildCopyText = () => {
    const isHome = match.homeTeam === career.clubName;

    const opponent = isHome ? match.awayTeam : match.homeTeam;
    const location = isHome ? "em casa" : "fora";

    const day = match.date.split("/")[0];

    const resultText =
      match.result === "V"
        ? "vitória"
        : match.result === "D"
          ? "derrota"
          : "empate";

    const myScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;

    const score = `${myScore} a ${opponentScore}`;

    const possession = `${isHome ? match.homePossession : match.awayPossession}%`;
    const shots = `${isHome ? match.homeFinishings : match.awayFinishings} a ${
      isHome ? match.awayFinishings : match.homeFinishings
    }`;

    const xg = `${isHome ? match.homeXG : match.awayXG} a ${
      isHome ? match.awayXG : match.homeXG
    }`;

    const getPlayerName = (id: string) => {
      const all = [
        ...(match.lineup?.lines || []),
        ...(match.lineup?.bench || []),
        match.lineup?.goalkeeper,
      ];
      return all.find((p) => p?.playerId === id)?.playerName || "Desconhecido";
    };

    const goals: string[] = [];

    (match.playerStats || []).forEach((stat) => {
      if (stat.goals > 0 && stat.goalMinutes?.length) {
        stat.goalMinutes.forEach((min) => {
          let assistText = "";

          if (stat.assistTargets?.length) {
            const assistName = stat.assistTargets[0].split(" - ")[0];

            const assistPlayer = (match.playerStats || []).find((s) =>
              getPlayerName(s.playerId).includes(assistName),
            );

            if (assistPlayer) {
              assistText = ` com assistencia de ${assistName} (${assistPlayer.rating})`;
            }
          }

          goals.push(
            `gol de ${getPlayerName(stat.playerId)} (${stat.rating}) aos ${min} minutos${assistText}`,
          );
        });
      }
    });

    const goalsText = goals.length > 0 ? goals.join(", e ") : "sem gols";

    return `Dia ${day}, ${opponent} ${location}, ${resultText} por ${score}, posse de ${possession} ${shots} em chutes com ${xg} de xG, ${goalsText}.`;
  };

  return (
    <Card className={Styles.card}>
      {match.status === "FINISHED" && (
        <div
          className={Styles.icon}
          onClick={() => {
            const text = buildCopyText();
            navigator.clipboard.writeText(text);
          }}
        >
          <FaRegCopy />
        </div>
      )}

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
