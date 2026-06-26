import { RankingType } from "../../types";

export const getRankingSuffix = (
  count: number,
  type: RankingType = "times",
): string => {
  if (type === "goals") return count === 1 ? "gol" : "gols";
  if (type === "assists") return count === 1 ? "assistência" : "assistências";
  return count === 1 ? "vez" : "vezes";
};
