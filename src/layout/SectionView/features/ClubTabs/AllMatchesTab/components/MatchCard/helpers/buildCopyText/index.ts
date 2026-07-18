import { Career } from "../../../../../../../../../common/interfaces/Career";
import { Match } from "../../../../../../../../../common/interfaces/Match";
import { isLeagueCompetition } from "../isLeagueCompetition";

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
  const location = isHome ? "Casa" : "Fora";
  const day = match.date.split("/")[0];

  const resultText =
    match.result === "V"
      ? "Vitória"
      : match.result === "D"
        ? "Derrota"
        : "Empate";

  const myScore = isHome ? match.homeScore : match.awayScore;
  const opponentScore = isHome ? match.awayScore : match.homeScore;
  const possession = isHome ? match.homePossession : match.awayPossession;
  const myShots = isHome ? match.homeFinishings : match.awayFinishings;
  const opponentShots = isHome ? match.awayFinishings : match.homeFinishings;
  const myXg = isHome ? match.homeXG : match.awayXG;
  const opponentXg = isHome ? match.awayXG : match.homeXG;

  const isLeague = isLeagueCompetition(match.league);
  const competitionText = isLeague ? "" : match.league;
  const matchContext = competitionText
    ? `${location}, ${competitionText}`
    : location;

  const getPlayerStat = (id?: string | null) => {
    if (!id) return undefined;
    return match.playerStats?.find((p) => p.playerId === id);
  };

  const buildHighlightText = (
    stat?: ReturnType<typeof getPlayerStat>,
  ): string => {
    if (!stat) return "";
    const parts: string[] = [];

    if (stat.goals > 0) {
      parts.push(`${stat.goals} gol(s) (${stat.goalMinutes?.join("', ")}')`);
    }

    if (stat.assists > 0) {
      const extractedMinutes = stat.assistTargets
        ?.map((target) => target.split(" - ")[1]?.replace("'", ""))
        .filter(Boolean);

      const assistMinutesText = extractedMinutes?.length
        ? ` (${extractedMinutes.join("', ")}')`
        : "";

      parts.push(`${stat.assists} ast.${assistMinutesText}`);
    }

    if (stat.defenses && stat.defenses > 0) {
      parts.push(`${stat.defenses} def.`);
    }

    if (stat.ownGoals && stat.ownGoals > 0) {
      parts.push(
        `${stat.ownGoals} gol(s) contra (${stat.ownGoalMinutes?.join("', ")}')`,
      );
    }

    return parts.join(" | ");
  };

  const mvp = [...(match.playerStats || [])].sort(
    (a, b) => b.rating - a.rating,
  )[0];

  const opponentMvpRating = match.opponentMvpRating || 0;
  const myMvpRating = mvp?.rating || 0;
  const isOurMvpOverall = myMvpRating >= opponentMvpRating && myMvpRating > 0;
  const isOpponentMvpOverall = opponentMvpRating > myMvpRating;

  const substitutionsByStarter = new Map<
    string,
    {
      playerName: string;
      rating: number;
      stat: NonNullable<typeof match.playerStats>[number];
    }
  >();

  (match.lineup?.bench || []).forEach((benchPlayer) => {
    const stat = getPlayerStat(benchPlayer.playerId);
    if (!stat?.substituteIn) return;
    substitutionsByStarter.set(stat.substituteIn, {
      playerName: benchPlayer.playerName || "Desc.",
      rating: stat.rating,
      stat,
    });
  });

  const buildPlayerText = (
    playerName: string,
    rating: number,
    stat?: ReturnType<typeof getPlayerStat>,
    isMvp?: boolean,
  ): string => {
    let text = `${playerName} (${rating})`;
    const highlight = buildHighlightText(stat);

    if (highlight) text += ` [${highlight}]`;
    if (isMvp) text += " ⭐MVP";

    const substitute = substitutionsByStarter.get(playerName);
    if (substitute && stat) {
      const substituteHighlight = buildHighlightText(substitute.stat);
      const isSubstituteMvp =
        isOurMvpOverall && mvp?.playerId === substitute.stat.playerId;

      text += ` -> ${substitute.playerName} (${substitute.rating}) aos ${stat.minutesPlayed}'`;
      if (substituteHighlight) text += ` [${substituteHighlight}]`;
      if (isSubstituteMvp) text += " ⭐MVP";
    }
    return text;
  };

  const buildOpponentEventsText = (): string => {
    const events = (
      match as Match & {
        opponentEvents?: {
          goals?: { minute: string; player: string }[];
          assists?: { goalReference: string; player: string }[];
          ownGoals?: { minute: string; player: string }[];
        };
      }
    ).opponentEvents;

    const parts: string[] = [];
    if (events?.goals?.length) {
      const goalsText = events.goals
        .map((goal) => {
          const goalReference = `${goal.player} - ${goal.minute}'`;
          const assist = events.assists?.find(
            (a) => a.goalReference === goalReference,
          );
          return assist
            ? `${goal.player} (${goal.minute}', ast: ${assist.player})`
            : `${goal.player} (${goal.minute}')`;
        })
        .join(", ");
      parts.push(`Gols: ${goalsText}`);
    }

    if (events?.ownGoals?.length) {
      const ownGoalsText = events.ownGoals
        .map((og) => `${og.player} (${og.minute}')`)
        .join(", ");
      parts.push(`GC: ${ownGoalsText}`);
    }

    if (
      isOpponentMvpOverall &&
      match.opponentMvpName &&
      match.opponentMvpRating
    ) {
      parts.push(
        `⭐MVP: ${match.opponentMvpName} (${match.opponentMvpRating})`,
      );
    }

    return parts.join(" | ");
  };

  const starters: string[] = [];
  if (match.lineup?.goalkeeper) {
    const stat = getPlayerStat(match.lineup.goalkeeper.playerId);
    starters.push(
      buildPlayerText(
        match.lineup.goalkeeper.playerName || "Desc.",
        stat?.rating || 0,
        stat,
        isOurMvpOverall && mvp?.playerId === match.lineup.goalkeeper.playerId,
      ),
    );
  }

  (match.lineup?.lines || []).forEach((player) => {
    const stat = getPlayerStat(player.playerId);
    starters.push(
      buildPlayerText(
        player.playerName || "Desc.",
        stat?.rating || 0,
        stat,
        isOurMvpOverall && mvp?.playerId === player.playerId,
      ),
    );
  });

  const startersText =
    starters.length > 0 ? `\n\nJogadores: ${starters.join(", ")}` : "";

  const opponentEventsText = buildOpponentEventsText();
  const oppText = opponentEventsText
    ? `\n\nAdversário: ${opponentEventsText}`
    : "";

  return `Dia ${day}: ${resultText} ${myScore}x${opponentScore} vs ${opponent} (${matchContext})\nPosse: ${possession}% | Chutes: ${myShots}x${opponentShots} | xG: ${myXg}x${opponentXg}${startersText}${oppText}`;
};
