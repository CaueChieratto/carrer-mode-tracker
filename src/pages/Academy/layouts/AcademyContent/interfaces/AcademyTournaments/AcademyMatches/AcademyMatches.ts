import { PlayerMatchesStats } from "./PlayerMatchesStats";

export interface AcademyMatches {
  id: string;
  date: string;
  opponentTeam: string;
  userGoals: number | undefined;
  opponentGoals: number | undefined;
  status?: string;
  result?: "SCHEDULED" | "FINISHED" | string;
  lineup: PlayerMatchesStats[];
}
