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

  const possession = isHome ? match.homePossession : match.awayPossession;

  const myShots = isHome ? match.homeFinishings : match.awayFinishings;

  const opponentShots = isHome ? match.awayFinishings : match.homeFinishings;

  const myXg = isHome ? match.homeXG : match.awayXG;
  const opponentXg = isHome ? match.awayXG : match.homeXG;

  const getPlayerName = (id?: string | null): string => {
    if (!id) return "Desconhecido";

    const all = [
      ...(match.lineup?.lines || []),
      ...(match.lineup?.bench || []),
      match.lineup?.goalkeeper,
    ];

    return all.find((p) => p?.playerId === id)?.playerName || "Desconhecido";
  };

  const getPlayerStat = (id?: string | null) => {
    if (!id) return undefined;

    return match.playerStats?.find((p) => p.playerId === id);
  };

  const starters: string[] = [];

  if (match.lineup?.goalkeeper) {
    const stat = getPlayerStat(match.lineup.goalkeeper.playerId);

    starters.push(
      `${match.lineup.goalkeeper.playerName} (${stat?.rating || 0})`,
    );
  }

  (match.lineup?.lines || []).forEach((player) => {
    const stat = getPlayerStat(player.playerId);

    starters.push(`${player.playerName} (${stat?.rating || 0})`);
  });

  const startersText =
    starters.length > 0 ? `os titulares foram ${starters.join(", ")}` : "";

  const benchPlayers: string[] = [];

  (match.playerStats || []).forEach((stat) => {
    if (!("substituteIn" in stat) || !stat.substituteIn) return;

    const playerName = getPlayerName(stat.playerId);

    benchPlayers.push(`${playerName} (${stat.rating})`);
  });

  const benchText =
    benchPlayers.length > 0
      ? `quem entrou do banco foi ${benchPlayers.join(", ")}`
      : "";

  const highlights: string[] = [];

  (match.playerStats || []).forEach((stat) => {
    const playerName = getPlayerName(stat.playerId);

    const parts: string[] = [];

    if (stat.goals > 0) {
      (stat.goalMinutes || []).forEach((minute) => {
        parts.push(
          `${stat.goals} ${
            stat.goals === 1 ? "gol" : "gols"
          } aos ${minute} minutos`,
        );
      });
    }

    if (stat.assists > 0) {
      (stat.assistTargets || []).forEach((target) => {
        const targetName = target.split(" - ")[0];

        parts.push(
          `${stat.assists} ${
            stat.assists === 1 ? "assistencia" : "assistencias"
          } pro ${targetName}`,
        );
      });
    }

    if (parts.length > 0) {
      highlights.push(`${playerName} ${parts.join(" e ")}`);
    }
  });

  const mvp = [...(match.playerStats || [])].sort(
    (a, b) => b.rating - a.rating,
  )[0];

  const mvpText =
    mvp && mvp.rating > 0
      ? `${getPlayerName(mvp.playerId)} (${mvp.rating}) foi eleito MVP`
      : "";

  return `Dia ${day}, jogo contra o ${opponent} ${location}, ${resultText} por ${myScore} a ${opponentScore}, posse de ${possession}%, ${myShots} a ${opponentShots} em chutes com ${myXg} a ${opponentXg} de xG${
    highlights.length > 0 ? `, ${highlights.join(", ")}` : ""
  }${mvpText ? `, ${mvpText}` : ""}${startersText ? `, ${startersText}` : ""}${
    benchText ? `, ${benchText}` : ""
  }.`;
};
