import { Career } from "../../../../../common/interfaces/Career";

export const getSeasonStartYear = (
  career: Career,
  seasonId: string,
): number => {
  const currentSeason = career.clubData.find((s) => s.id === seasonId);
  const seasonNumber = currentSeason?.seasonNumber || 1;
  return new Date(career.createdAt).getFullYear() + (seasonNumber - 1);
};
