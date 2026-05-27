import { Match } from "../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { Teams } from "../../../pages/AddMatches/interface/teams";
import { League } from "../../utils/Leagues";
import { Players } from "../playersInfo/players";

export interface ClubData {
  players: Players[];
  seasonNumber: number;
  id: string;
  leagues?: League[];
  matches?: Match[];
  teams?: Teams[];
}
