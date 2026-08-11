import { PlayerMatchesStats } from "./PlayerMatchesStats";

export interface AcademyMatches {
  id: string;
  date: string;
  opponentTeam: string;
  userGoals: number | undefined;
  opponentGoals: number | undefined;
  userPenalties?: number;
  opponentPenalties?: number;
  status?: string;
  result?: "SCHEDULED" | "FINISHED" | string;
  lineup: PlayerMatchesStats[];
}
