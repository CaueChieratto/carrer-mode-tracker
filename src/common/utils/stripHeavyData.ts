import { ClubData } from "../interfaces/club/clubData";

export const stripHeavyData = (clubData: ClubData[]): ClubData[] => {
  return clubData.map((season) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { matches, players, ...cleanSeason } = season;
    return {
      ...cleanSeason,
      players: [],
    } as ClubData;
  });
};
