import { AcademyMatches } from "./AcademyMatches/AcademyMatches";

export interface AcademyTournaments {
  id: string;
  name: string;
  date: string;
  totalMatches: number;
  matches: AcademyMatches[];
  tournamentResult: string;
  isChampion: boolean;
  isFinished?: boolean;
}
