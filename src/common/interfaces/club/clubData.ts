import { Match } from "../../../components/AllMatchesTab/types/Match";
import { League } from "../../utils/Leagues";
import { Players } from "../playersInfo/players";

export interface ClubData {
  players: Players[];
  seasonNumber: number;
  id: string;
  leagues?: League[];
  matches?: Match[];
}
