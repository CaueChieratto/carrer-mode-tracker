import { Players } from "../../../../../../../common/interfaces/playersInfo/players";

type AcademyTournament = NonNullable<Players["academyTournaments"]>[number];

export const buildAcademyTrophies = (
  filteredTournaments: AcademyTournament[],
) => {
  const championTournaments = filteredTournaments
    .filter((t) => t.isChampion)
    .map((t) => ({
      ...t,
      cleanName: t.name.split("-")[0].trim(),
    }));

  const groupedTournaments = championTournaments.reduce(
    (acc, curr) => {
      const name = curr.cleanName;
      if (!acc[name]) {
        acc[name] = {
          leagueName: name,
          leagueImage: "/images/leagues/default.png",
          seasons: [],
        };
      }
      acc[name].seasons.push("Base");
      return acc;
    },
    {} as Record<
      string,
      { leagueName: string; leagueImage: string; seasons: string[] }
    >,
  );

  return Object.values(groupedTournaments);
};
