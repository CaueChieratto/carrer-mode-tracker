import { ClubData } from "../../../common/interfaces/club/clubData";
import { Trophy } from "../../../common/interfaces/club/trophy";

export interface Career {
  id: string;
  clubName: string;
  managerName: string;
  createdAt: Date;
  teamBadge: string;
  nation: string;
  colorsTeams: string[];
  trophies: Trophy[];
  clubData: ClubData[];
}
