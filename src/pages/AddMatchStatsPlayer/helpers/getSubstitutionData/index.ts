import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { Match } from "../../../../components/AllMatchesTab/types/Match";

export const getSubstitutionData = (
  match: Match,
  season: ClubData,
  player: Players,
): { isStarter: boolean; options: string[] } => {
  if (!match?.lineup || !season?.players || !player) {
    return { isStarter: true, options: ["Nenhum"] };
  }

  const allStats = match.playerStats || [];

  const startersIds = [
    match.lineup.goalkeeper?.playerId,
    ...(match.lineup.lines?.flat().map((s) => s.playerId) || []),
  ].filter(Boolean);

  const benchIds =
    match.lineup.bench?.map((s) => s.playerId).filter(Boolean) || [];

  const isStarter = startersIds.includes(player.id);

  const currentSub = allStats.find(
    (s) => s.playerId === player.id,
  )?.substituteIn;

  let options: string[] = [];

  if (isStarter) {
    const otherStartersStats = allStats.filter(
      (s) => s.playerId !== player.id && startersIds.includes(s.playerId),
    );
    const usedBenchNames = otherStartersStats
      .map((s) => s.substituteIn)
      .filter(Boolean);

    const benchNames = benchIds
      .map((id) => season.players.find((p) => p.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    options = benchNames.filter(
      (n) => !usedBenchNames.includes(n) || n === currentSub,
    );
  } else {
    const otherBenchStats = allStats.filter(
      (s) => s.playerId !== player.id && benchIds.includes(s.playerId),
    );
    const usedStarterNames = otherBenchStats
      .map((s) => s.substituteIn)
      .filter(Boolean);

    const starterNames = startersIds
      .map((id) => season.players.find((p) => p.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    options = starterNames.filter(
      (n) => !usedStarterNames.includes(n) || n === currentSub,
    );
  }

  return { isStarter, options: ["Nenhum", ...options] };
};
