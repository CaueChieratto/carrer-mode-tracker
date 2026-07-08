import { RankingType } from "../../../../../../../common/interfaces/Curiosities";

export const getRankingSuffix = (
  count: number,
  type: RankingType = "times",
): string => {
  if (type === "goals") return count === 1 ? "gol" : "gols";
  if (type === "assists") return count === 1 ? "assistência" : "assistências";
  if (type === "participations")
    return count === 1 ? "participação" : "participações";

  return count === 1 ? "vez" : "vezes";
};
