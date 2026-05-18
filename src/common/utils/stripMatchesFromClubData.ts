import { ClubData } from "../interfaces/club/clubData";

export const stripMatchesFromClubData = (clubData: ClubData[]) => {
  return clubData.map((season) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { matches, ...seasonWithoutMatches } = season;
    return seasonWithoutMatches;
  });
};
