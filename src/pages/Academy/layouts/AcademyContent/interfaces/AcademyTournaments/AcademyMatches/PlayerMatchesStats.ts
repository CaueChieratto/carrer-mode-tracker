export interface PlayerMatchesStats {
  playerId: string;
  playerName: string;
  goals: number | null;
  assists: number | null;
  rating: number | null;
  defesas?: number | null;
  cleanSheets?: number | null;
}
