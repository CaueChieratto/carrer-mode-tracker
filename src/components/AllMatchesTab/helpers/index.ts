import { MatchResult } from "../types/MatchResult";

const RESULT_COLORS: Record<MatchResult, string> = {
  V: "#4caf50",
  D: "#f44336",
  E: "#9e9e9e",
  "?": "#bdbdbd",
};

export const getResultColor = (result: MatchResult): string =>
  RESULT_COLORS[result];
