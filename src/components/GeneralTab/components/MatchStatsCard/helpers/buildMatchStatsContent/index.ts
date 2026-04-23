import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { calculateMatchStats } from "../calculateMatchStats";
import { formatMatchStats } from "../formatMatchStats";

export const buildMatchStatsContent = (
  career: Career,
  season: ClubData,
  isGeralPage: boolean = false,
) => {
  let matchesToCalculate = [];

  if (isGeralPage && career.clubData) {
    matchesToCalculate = career.clubData.flatMap((s) => s.matches || []);
  } else {
    matchesToCalculate = season.matches || [];
  }

  const finishedMatches = matchesToCalculate.filter(
    (m) => m.status === "FINISHED",
  );

  if (finishedMatches.length === 0) return [];

  const aggregated = calculateMatchStats(finishedMatches, career.clubName);

  return formatMatchStats(aggregated, finishedMatches.length);
};
