import { Players } from "../../../../../../common/interfaces/playersInfo/players";

export type PlayerStatsAccumulator = {
  player: Players;
  games: number;
  ratingSum: number;
  goals: number;
  assists: number;
  minutesPlayed: number;
  totalFinishings: number;
  finishingsMissed: number;
  totalPasses: number;
  passesMissed: number;
  keyPasses: number;
  totalDribbles: number;
  dribblesMissed: number;
  ballsRecovered: number;
  ballsLost: number;
  yellowCards: number;
  redCards: number;
  distanceKm: number;
  maxDistanceKmInGame: number;
};
