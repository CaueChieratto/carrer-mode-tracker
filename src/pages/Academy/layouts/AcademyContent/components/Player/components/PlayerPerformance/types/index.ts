export interface TournamentStats {
  tournamentId: string;
  tournamentName: string;
  season: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  averageRating: string;
  ratingRawNumber: number;
  isChampion: boolean;
  defesas: number;
  isGoleiro: boolean;
}

export interface TotalStats {
  matchesPlayed: number;
  totalGoals: number;
  totalAssists: number;
  averageRating: string;
  tournamentsWon: number;
  ratingRawNumber: number;
  totalDefesas: number;
  isGoleiro: boolean;
}
