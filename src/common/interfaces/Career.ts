import { ClubData } from "./club/clubData";
import { Trophy } from "./club/trophy";

export interface Career {
  id: string;
  clubName: string;
  managerName: string;
  createdAt: Date;
  teamBadge: string;
  nation: string;
  currency?: string;
  updatedAt?: number;
  colorsTeams: string[];
  trophies: Trophy[];
  clubData: ClubData[];
}
