import { Teams } from "../../../../../common/interfaces/Teams";

export const isCustomTeam = (team: Teams): boolean => {
  return (
    !team.badge ||
    team.badge.includes("cloudinary") ||
    team.badge.includes("firebase")
  );
};
