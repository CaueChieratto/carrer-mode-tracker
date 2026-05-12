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

  const getPlayerStat = (id?: string | null) => {
    if (!id) return undefined;

    return match.playerStats?.find((p) => p.playerId === id);
  };

  const buildGoalsText = (goals: number, minutes: number[]): string => {
    if (goals <= 0 || minutes.length === 0) return "";

    const minutesText = minutes.map((minute) => `${minute} minutos`).join(", ");

    return `${goals} ${goals === 1 ? "gol" : "gols"} aos ${minutesText}`;
  };

  const buildHighlightText = (
    stat?: ReturnType<typeof getPlayerStat>,
  ): string => {
    if (!stat) return "";

    const parts: string[] = [];

    if (stat.goals > 0) {
      parts.push(buildGoalsText(stat.goals, stat.goalMinutes || []));
    }

    if (stat.assists > 0) {
      parts.push(
        `${stat.assists} ${
          stat.assists === 1 ? "assistencia" : "assistencias"
        }`,
      );
    }

    return parts.join(" e ");
  };

  const mvp = [...(match.playerStats || [])].sort(
    (a, b) => b.rating - a.rating,
  )[0];

  const buildPlayerText = (
    playerName: string,
    rating: number,
    stat?: ReturnType<typeof getPlayerStat>,
    isMvp?: boolean,
  ): string => {
    const highlight = buildHighlightText(stat);

    return `${playerName} (${rating})${
      highlight ? ` ${highlight}` : ""
    }${isMvp ? " e foi eleito o MVP" : ""}`;
  };

  const starters: string[] = [];

  if (match.lineup?.goalkeeper) {
    const stat = getPlayerStat(match.lineup.goalkeeper.playerId);

    starters.push(
      buildPlayerText(
        match.lineup.goalkeeper.playerName || "Desconhecido",
        stat?.rating || 0,
        stat,
        mvp?.playerId === match.lineup.goalkeeper.playerId,
      ),
    );
  }

  (match.lineup?.lines || []).forEach((player) => {
    const stat = getPlayerStat(player.playerId);

    starters.push(
      buildPlayerText(
        player.playerName || "Desconhecido",
        stat?.rating || 0,
        stat,
        mvp?.playerId === player.playerId,
      ),
    );
  });

  const startersText =
    starters.length > 0 ? `os titulares foram ${starters.join(", ")}` : "";

  const starterIds = new Set<string>();

  const gkId = match.lineup?.goalkeeper?.playerId;
  if (gkId) {
    starterIds.add(gkId);
  }

  (match.lineup?.lines || []).forEach((player) => {
    if (player.playerId) {
      starterIds.add(player.playerId);
    }
  });

  const benchPlayers: string[] = [];

  (match.lineup?.bench || []).forEach((benchPlayer) => {
    if (!benchPlayer.playerId) return;

    if (starterIds.has(benchPlayer.playerId)) return;

    const stat = getPlayerStat(benchPlayer.playerId);

    if (!stat) return;

    benchPlayers.push(
      buildPlayerText(
        benchPlayer.playerName || "Desconhecido",
        stat.rating,
        stat,
        mvp?.playerId === benchPlayer.playerId,
      ),
    );
  });

  const benchText =
    benchPlayers.length > 0
      ? `quem entrou do banco foi ${benchPlayers.join(", ")}`
      : "";

  return `Dia ${day}, jogo contra o ${opponent} ${location}, ${resultText} por ${myScore} a ${opponentScore}, posse de ${possession}%, ${myShots} a ${opponentShots} em chutes com ${myXg} a ${opponentXg} de xG${
    startersText ? `, ${startersText}` : ""
  }${benchText ? `, ${benchText}` : ""}.`;
};
