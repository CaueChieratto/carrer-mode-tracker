import { Career } from "../../../../../../../../../../../../common/interfaces/Career";

export const buildTeamOptions = (career: Career): string[] => {
  const teamNames = new Set<string>();
  career?.clubData?.forEach((season) => {
    season.teams?.forEach((t) => {
      if (t.name) {
        teamNames.add(t.name.trim());
      }
    });
  });
  return Array.from(teamNames).sort();
};
