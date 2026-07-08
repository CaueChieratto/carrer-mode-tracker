export type QualificationZone =
  | "first"
  | "champions"
  | "europa"
  | "conference"
  | "relegation"
  | "none";

export type TableRowData = {
  id: string;
  position: number;
  badge: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  zone: QualificationZone;
};
