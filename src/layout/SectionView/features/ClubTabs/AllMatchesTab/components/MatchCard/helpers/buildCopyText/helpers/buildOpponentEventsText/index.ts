import { Match } from "../../../../../../../../../../../common/interfaces/Match";

type OpponentEvents = {
  goals?: { minute: string; player: string }[];
  assists?: { goalReference: string; player: string }[];
  ownGoals?: { minute: string; player: string }[];
};

export const buildOpponentEventsText = (
  match: Match,
  isOpponentMvpOverall: boolean,
): string => {
  const events = (
    match as Match & {
      opponentEvents?: OpponentEvents;
    }
  ).opponentEvents;

  const parts: string[] = [];

  if (events?.goals?.length) {
    parts.push(
      `Gols: ${events.goals
        .map((goal) => {
          const assist = events.assists?.find(
            (a) => a.goalReference === `${goal.player} - ${goal.minute}'`,
          );

          return assist
            ? `${goal.player} (${goal.minute}', ast: ${assist.player})`
            : `${goal.player} (${goal.minute}')`;
        })
        .join(", ")}`,
    );
  }

  if (events?.ownGoals?.length) {
    parts.push(
      `GC: ${events.ownGoals
        .map((goal) => `${goal.player} (${goal.minute}')`)
        .join(", ")}`,
    );
  }

  if (
    isOpponentMvpOverall &&
    match.opponentMvpName &&
    match.opponentMvpRating
  ) {
    parts.push(`⭐MVP: ${match.opponentMvpName} (${match.opponentMvpRating})`);
  }

  return parts.join(" | ");
};
