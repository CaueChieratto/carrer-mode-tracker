import { League } from "../League";

export interface Teams {
  badge?: string;
  name: string;
  leagueName?: League["name"];
}
