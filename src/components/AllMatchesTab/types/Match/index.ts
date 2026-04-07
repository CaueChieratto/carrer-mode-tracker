import { SavedLineup } from "../../../../pages/Match/types/Lineup";
import { MatchResult } from "../MatchResult";
import { MatchStatus } from "../MatchStatus";
import { PlayerMatchStat } from "../PlayerMatchStat";

export type Match = {
  matchesId: string;
  date: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  result: MatchResult;
  status: MatchStatus;
  playerStats?: PlayerMatchStat[];
  lineup?: SavedLineup;
};
