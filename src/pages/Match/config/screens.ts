export type MatchScreen =
  | { key: "addMatchStatsPlayer"; playerId: string }
  | { key: "addStatsMatch" }
  | { key: "addMatchDetails" };
