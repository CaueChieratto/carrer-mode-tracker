import { Positions } from "../../types/Positions";
import { LeagueStats } from "../playersStats/leagueStats";
import { Contract } from "./contract";

export interface Players {
  ballonDor: number;
  overall: number;
  id: string;
  name: string;
  position: keyof Positions | string;
  sector: string;
  age: number;
  salary: number;
  nation: string;
  shirtNumber: string;
  playerValue: number;
  buy: boolean;
  captain: boolean;
  sell: boolean;
  contractTime: number;
  contract: Contract[];
  statsLeagues: LeagueStats[];
}
