import { QualificationZone } from "../Table";

export interface TableTeamData {
  id: string;
  name: string;
  badge: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  customZone?: QualificationZone | "default";
}
