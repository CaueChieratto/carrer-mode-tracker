import { Career } from "../../../../../../../../../../../../common/interfaces/Career";

export const buildTeamOptions = (careers: Career[]): string[] => {
  const teamNames = new Set<string>();
  careers?.forEach((career) => {
    career?.clubData?.forEach((season) => {
      season.teams?.forEach((t) => {
        if (t.name) {
          teamNames.add(t.name.trim());
        }
      });
    });
  });
  return Array.from(teamNames).sort();
};
