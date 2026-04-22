export interface PlayerMatchStat {
  playerId: string;
  minutesPlayed: number;
  goals: number;
  defenses: number;
  assists: number;
  goalMinutes?: number[];
  assistTargets?: string[];
  yellowCardMinute?: number;
  secondYellowCardMinute?: number;
  redCardMinute?: number;
  distanceKm: number;
  passes: number;
  finishings: number;
  rating: number;
  yellowCard: boolean;
  secondYellowCard?: boolean;
  redCard: boolean;
  cleanSheet?: boolean;
  substituteIn?: string | undefined;
}
