export type RankingType = "goals" | "assists" | "times";

export interface RankingItem {
  label: string;
  count: number;
}

export interface HighlightItem {
  label: string;
  value: string;
}

export interface CuriositiesRankings {
  topScoringMinutes: RankingItem[];
  topConcedingMinutes: RankingItem[];
  topPlayerGoalMinutes: RankingItem[];
  topPlayerAssistMinutes: RankingItem[];
  topOpponentScorers: RankingItem[];
  topTeamDuos: RankingItem[];
  topOpponentDuos: RankingItem[];
  topReincidents: RankingItem[];
  topScores: RankingItem[];
  topOpponents: RankingItem[];
  topVictims: RankingItem[];
  topPunchingBags: RankingItem[];
  topOpponentTeamsScorers: RankingItem[];
  topDecisivePlayers: RankingItem[];
  topOpeners: RankingItem[];
  topWinAssistants: RankingItem[];
  topStoppageTimeExperts: RankingItem[];
  dangerousIntervals: RankingItem[];
}

export interface CuriositiesData {
  highlights: HighlightItem[];
  rankings: CuriositiesRankings | null;
}

export interface OpponentGoal {
  player?: string;
  minute?: string | number;
}

export interface OpponentAssist {
  player?: string;
  goalReference?: string;
}
