import { Match } from "../../../components/AllMatchesTab/types/Match";
import { Career } from "../../interfaces/Career";

type BuildMatchCopyTextParams = {
  match: Match;
  career: Career;
};

export const buildMatchCopyText = ({
  match,
  career,
}: BuildMatchCopyTextParams): string => {
  const isHome = match.homeTeam === career.clubName;

  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const location = isHome ? "em casa" : "fora de casa";

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

  const shots = `${
    isHome ? match.homeFinishings : match.awayFinishings
  } a ${isHome ? match.awayFinishings : match.homeFinishings}`;

  const xg = `${isHome ? match.homeXG : match.awayXG} a ${
    isHome ? match.awayXG : match.homeXG
  }`;

  const getPlayerName = (id: string): string => {
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
        goals.push(
          `gol de ${getPlayerName(stat.playerId)} (${stat.rating}) aos ${min} minutos`,
        );
      });
    }
  });

  const goalsText = goals.length > 0 ? goals.join(", e ") : "sem gols";

  return `Dia ${day}, ${opponent} ${location}, ${resultText} por ${score}, posse de ${possession} ${shots} em chutes com ${xg} de xG, ${goalsText}.`;
};
