import { Match } from "../../../../../../../../../../../common/interfaces/Match";

type PlayerStat = NonNullable<Match["playerStats"]>[number];

export const buildHighlightText = (stat?: PlayerStat): string => {
  if (!stat) return "";

  const parts: string[] = [];

  if (stat.goals > 0) {
    parts.push(`${stat.goals} gol(s) (${stat.goalMinutes?.join("', ")}')`);
  }

  if (stat.assists > 0) {
    const minutes = stat.assistTargets
      ?.map((target) => target.split(" - ")[1]?.replace("'", ""))
      .filter(Boolean);

    parts.push(
      `${stat.assists} ast.${minutes?.length ? ` (${minutes.join("', ")}')` : ""}`,
    );
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
