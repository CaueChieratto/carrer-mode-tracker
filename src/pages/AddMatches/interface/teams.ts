import { League } from "../../../common/utils/Leagues";

export interface Teams {
  badge?: string;
  name: string;
  leagueName?: League["name"];
}
