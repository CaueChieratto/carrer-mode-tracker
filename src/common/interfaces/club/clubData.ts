import { Match } from "../Match";
import { Teams } from "../Teams";
import { League } from "../League";
import { Players } from "../playersInfo/players";
import { TableRowData } from "../Table";

export interface ClubData {
  players: Players[];
  seasonNumber: number;
  id: string;
  leagues?: League[];
  matches?: Match[];
  teams?: Teams[];
  table?: TableRowData[];
}
