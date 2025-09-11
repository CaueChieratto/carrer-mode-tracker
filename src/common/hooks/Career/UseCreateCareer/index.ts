import { v4 as uuidv4 } from "uuid";
import { parseFullBrasilDate } from "../../../utils/Date";
import { Career } from "../../../interfaces/Career";
import { fetchTeamByClubName } from "../../../services/APICareerService";
import { ColorsService } from "../../../services/ColorsService";

type UseCreateCareerProps = {
  club: string;
  manager: string;
  nation: string;
  createdAt: string;
};

export async function UseCreateCareer({
  club,
  manager,
  nation,
  createdAt,
}: UseCreateCareerProps): Promise<Career> {
  const team = await fetchTeamByClubName(club);
  const createdAtParsed = parseFullBrasilDate(createdAt) ?? new Date();

  const newCareer: Career = {
    id: uuidv4(),
    clubName: team?.strTeam || club,
    managerName: manager,
    createdAt: createdAtParsed,
    teamBadge: team?.strBadge || "",
    nation: nation,
    colorsTeams:
      [team?.strColour1, team?.strColour2].filter(Boolean).length > 0
        ? [team.strColour1, team.strColour2]
        : ["#ffffff", "#ffffff"],
    trophies: [],
    clubData: [],
  };

  if (newCareer.colorsTeams.length > 0 && newCareer.colorsTeams[0]) {
    ColorsService.saveColors(newCareer.id, newCareer.colorsTeams[0]);
  }

  return newCareer;
}
