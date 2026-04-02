export interface PlayerMatchStat {
  playerId: string;
  minutesPlayed: number;
  goals: number;
  xG: number;
  assists: number;
  xA: number;
  distanceKm: number;
  passes: number;
  finishings: number;
  rating: number;
  yellowCard: boolean;
  redCard: boolean;
  cleanSheet: boolean;
}
