import { Match } from "../../../../types/Match";
import { Career } from "../../../../../../common/interfaces/Career";

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

  const starters: string[] = [];

  if (match.lineup?.goalkeeper?.playerName) {
    starters.push(match.lineup.goalkeeper.playerName);
  }

  (match.lineup?.lines || []).forEach((p) => {
    if (p?.playerName) {
      starters.push(p.playerName);
    }
  });

  const startersText =
    starters.length > 0 ? `vamos com ${starters.join(", ")}, ` : "";

  const playerHighlights: string[] = [];

  (match.playerStats || []).forEach((stat) => {
    const playerName = getPlayerName(stat.playerId);

    const parts: string[] = [];

    if (stat.goals > 0) {
      parts.push(`${stat.goals} ${stat.goals === 1 ? "gol" : "gols"}`);
    }

    if (stat.assists > 0) {
      parts.push(
        `${stat.assists} ${
          stat.assists === 1 ? "assistencia" : "assistencias"
        }`,
      );
    }

    if (parts.length > 0) {
      playerHighlights.push(
        `${playerName} (${stat.rating}) ${parts.join(" e ")}`,
      );
    }
  });

  const mvp = [...(match.playerStats || [])].sort(
    (a, b) => b.rating - a.rating,
  )[0];

  const mvpText =
    mvp && mvp.rating > 0
      ? `${getPlayerName(mvp.playerId)} (${mvp.rating}) foi eleito MVP`
      : "";

  const highlightsText = playerHighlights.join(", ");

  return `Dia ${day}, ${opponent} ${location}, ${startersText}${resultText} por ${score}, posse de ${possession}, ${shots} em chutes com ${xg} de xG${
    highlightsText ? `, ${highlightsText}` : ""
  }${mvpText ? `${highlightsText ? "," : ""} ${mvpText}` : ""}.`;
};
