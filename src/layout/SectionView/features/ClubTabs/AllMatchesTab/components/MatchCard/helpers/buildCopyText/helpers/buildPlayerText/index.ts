import { Match } from "../../../../../../../../../../../common/interfaces/Match";
import { buildHighlightText } from "../buildHighlightText";
import { SubstitutionEntry } from "../buildSubstitutionsMap";

type PlayerStat = NonNullable<Match["playerStats"]>[number];

type BuildPlayerTextParams = {
  playerName: string;
  rating: number;
  stat?: PlayerStat;
  isMvp: boolean;
  isOurMvpOverall: boolean;
  mvpPlayerId?: string;
  substitutions: Map<string, SubstitutionEntry>;
};

export const buildPlayerText = ({
  playerName,
  rating,
  stat,
  isMvp,
  isOurMvpOverall,
  mvpPlayerId,
  substitutions,
}: BuildPlayerTextParams): string => {
  let text = `${playerName} (${rating})`;

  const highlight = buildHighlightText(stat);

  if (highlight) {
    text += ` [${highlight}]`;
  }

  if (isMvp) {
    text += " ⭐MVP";
  }

  const substitute = substitutions.get(playerName);

  if (!substitute || !stat) {
    return text;
  }

  const substituteHighlight = buildHighlightText(substitute.stat);

  text += ` -> ${substitute.playerName} (${substitute.rating}) aos ${stat.minutesPlayed}'`;

  if (substituteHighlight) {
    text += ` [${substituteHighlight}]`;
  }

  if (isOurMvpOverall && substitute.stat.playerId === mvpPlayerId) {
    text += " ⭐MVP";
  }

  return text;
};
