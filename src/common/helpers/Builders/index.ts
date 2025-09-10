import { Career } from "../../interfaces/Career";

export const buildCareerUpdates = (updates: {
  colorsTeams?: string[];
  fileDataUrl?: string;
  clubName?: string;
  managerName?: string;
}): Partial<Career> => {
  const updateObj: Partial<Career> = {};
  if (updates.colorsTeams) updateObj.colorsTeams = updates.colorsTeams;
  if (updates.fileDataUrl) updateObj.teamBadge = updates.fileDataUrl;
  if (updates.clubName) updateObj.clubName = updates.clubName;
  if (updates.managerName) updateObj.managerName = updates.managerName;
  return updateObj;
};
