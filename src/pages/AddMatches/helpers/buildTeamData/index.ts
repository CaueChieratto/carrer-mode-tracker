import { League } from "../../../../common/utils/Leagues";
import { fetchTeamByClubName } from "../../API/TheSportsDBTeam";
import { Teams } from "../../interface/teams";

interface BuildTeamDataParams {
  opponentTeam: string;
  selectedLeague?: League;
}

export async function buildTeamData({
  opponentTeam,
  selectedLeague,
}: BuildTeamDataParams): Promise<Teams> {
  const teamApi = await fetchTeamByClubName(opponentTeam);

  const teamData: Teams = {
    name: opponentTeam,
    badge: teamApi?.strBadge || "",
  };

  if (selectedLeague?.name) {
    teamData.leagueName = selectedLeague.name;
  }

  return teamData;
}
