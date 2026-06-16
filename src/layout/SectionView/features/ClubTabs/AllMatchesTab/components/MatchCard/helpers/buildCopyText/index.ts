import { Career } from "../../../../../../../../../common/interfaces/Career";
import { Match } from "../../../../types/Match";
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

  const isLeague = isLeagueCompetition(match.league);

  const competitionText = isLeague ? "" : `pela ${match.league}`;

  const matchContext = competitionText
    ? `${location} ${competitionText}`
    : location;

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
          stat.assists === 1 ? "assistência" : "assistências"
        }`,
      );
    }

    if (stat.defenses && stat.defenses > 0) {
      parts.push(
        `${stat.defenses} ${stat.defenses === 1 ? "defesa" : "defesas"}`,
      );
    }

    if (stat.ownGoals && stat.ownGoals > 0) {
      const ownGoalMinutesText = (stat.ownGoalMinutes || [])
        .map((minute) => `${minute} minutos`)
        .join(", ");

      const ownGoalText = `${stat.ownGoals} ${
        stat.ownGoals === 1 ? "gol contra" : "gols contra"
      }`;

      parts.push(
        ownGoalMinutesText
          ? `${ownGoalText} aos ${ownGoalMinutesText}`
          : ownGoalText,
      );
    }

    return parts.join(" e ");
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
      playerName: benchPlayer.playerName || "Desconhecido",
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

    if (highlight) {
      text += ` ${highlight}`;
    }

    if (isMvp) {
      text += " foi eleito o MVP";
    }

    const substitute = substitutionsByStarter.get(playerName);

    if (substitute && stat) {
      const substituteHighlight = buildHighlightText(substitute.stat);

      const isSubstituteMvp =
        isOurMvpOverall && mvp?.playerId === substitute.stat.playerId;

      text += ` e saiu aos ${stat.minutesPlayed} minutos para entrada do ${substitute.playerName} (${substitute.rating})`;

      if (substituteHighlight) {
        text += ` ${substituteHighlight}`;
      }

      if (isSubstituteMvp) {
        text += " que foi eleito o MVP";
      }
    }

    return text;
  };

  const buildOpponentEventsText = (): string => {
    const events = (
      match as Match & {
        opponentEvents?: {
          goals?: {
            minute: string;
            player: string;
          }[];
          assists?: {
            goalReference: string;
            player: string;
          }[];
          ownGoals?: {
            minute: string;
            player: string;
          }[];
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

          if (assist) {
            return `${goal.player} aos ${goal.minute} minutos com assistência do ${assist.player}`;
          }

          return `${goal.player} aos ${goal.minute} minutos`;
        })
        .join(", ");

      parts.push(`gols do adversário: ${goalsText}`);
    }

    if (events?.ownGoals?.length) {
      const ownGoalsText = events.ownGoals
        .map((og) => `${og.player} aos ${og.minute} minutos`)
        .join(", ");

      parts.push(`gols contra a favor: ${ownGoalsText}`);
    }

    if (
      isOpponentMvpOverall &&
      match.opponentMvpName &&
      match.opponentMvpRating
    ) {
      parts.push(
        `sendo ${match.opponentMvpName} o MVP da partida com nota ${match.opponentMvpRating}`,
      );
    }

    return parts.join(", e ");
  };

  const starters: string[] = [];

  if (match.lineup?.goalkeeper) {
    const stat = getPlayerStat(match.lineup.goalkeeper.playerId);

    starters.push(
      buildPlayerText(
        match.lineup.goalkeeper.playerName || "Desconhecido",
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
        player.playerName || "Desconhecido",
        stat?.rating || 0,
        stat,
        isOurMvpOverall && mvp?.playerId === player.playerId,
      ),
    );
  });

  const startersText = starters.length > 0 ? `${starters.join(", ")}` : "";

  const opponentEventsText = buildOpponentEventsText();

  return `Dia ${day}, jogo contra o ${opponent} ${matchContext}, ${resultText} por ${myScore} a ${opponentScore}, posse de ${possession}%, ${myShots} a ${opponentShots} em chutes com ${myXg} a ${opponentXg} de xG${
    startersText ? `, ${startersText}` : ""
  }${opponentEventsText ? `, ${opponentEventsText}` : ""}.`;
};
