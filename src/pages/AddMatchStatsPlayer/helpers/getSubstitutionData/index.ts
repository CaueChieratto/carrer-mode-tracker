import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Players } from "../../../../common/interfaces/playersInfo/players";
import { Match } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";

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

    const usedNames = otherBenchStats
      .map((s) => {
        const targetName = s.substituteIn;
        if (!targetName) return null;

        const targetPlayer = season.players.find((p) => p.name === targetName);

        if (targetPlayer && benchIds.includes(targetPlayer.id)) {
          const targetStat = allStats.find(
            (st) => st.playerId === targetPlayer.id,
          );
          const currentPlayerName = season.players.find(
            (p) => p.id === s.playerId,
          )?.name;

          if (targetStat && targetStat.substituteIn === currentPlayerName) {
            const sMinutes = s.minutesPlayed || 0;
            const targetMinutes = targetStat.minutesPlayed || 0;

            if (sMinutes < targetMinutes) {
              return targetName;
            } else {
              return null;
            }
          }
        }
        return targetName;
      })
      .filter((name): name is string => Boolean(name));

    const starterNames = startersIds
      .map((id) => season.players.find((p) => p.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    const otherBenchNames = benchIds
      .filter((id) => id !== player.id)
      .map((id) => season.players.find((p) => p.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    const possibleSubOutNames = [...starterNames, ...otherBenchNames];

    options = possibleSubOutNames.filter(
      (n) => !usedNames.includes(n) || n === currentSub,
    );
  }

  return { isStarter, options: ["Nenhum", ...options] };
};
