export interface PlayerMatchStat {
  playerId: string;
  minutesPlayed: number;
  goals: number;
  defenses: number;
  assists: number;
  distanceKm: number;
  passes: number;
  finishings: number;
  rating: number;
  yellowCard: boolean;
  redCard: boolean;
  cleanSheet?: boolean;
  substituteIn?: string | undefined;
}
