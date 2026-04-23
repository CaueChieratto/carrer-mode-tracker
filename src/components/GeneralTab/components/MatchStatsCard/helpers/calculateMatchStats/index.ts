import { ClubData } from "../../../../../../common/interfaces/club/clubData";

type Match = NonNullable<ClubData["matches"]>[number];

export interface AggregatedStats {
  totalRating: number;
  ratingCount: number;
  goalsScored: number;
  goalsConceded: number;
  totalXG: number;
  totalAssists: number;
  totalFinishings: number;
  totalFinishingsOnTarget: number;
  totalPossession: number;
  totalPasses: number;
  totalPassesCompleted: number;
  cleanSheets: number;
  totalDefenses: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalBallRecovery: number;
  totalDistance: number;
}

const getValue = (isHome: boolean, home?: number, away?: number): number =>
  (isHome ? home : away) ?? 0;

export const calculateMatchStats = (
  matches: Match[],
  teamName: string,
): AggregatedStats => {
  const stats: AggregatedStats = {
    totalRating: 0,
    ratingCount: 0,
    goalsScored: 0,
    goalsConceded: 0,
    totalXG: 0,
    totalAssists: 0,
    totalFinishings: 0,
    totalFinishingsOnTarget: 0,
    totalPossession: 0,
    totalPasses: 0,
    totalPassesCompleted: 0,
    cleanSheets: 0,
    totalDefenses: 0,
    totalYellowCards: 0,
    totalRedCards: 0,
    totalBallRecovery: 0,
    totalDistance: 0,
  };

  matches.forEach((match) => {
    const isHome = match.homeTeam === teamName;

    const scored = getValue(isHome, match.homeScore, match.awayScore);
    const conceded = getValue(isHome, match.awayScore, match.homeScore);

    stats.goalsScored += scored;
    stats.goalsConceded += conceded;

    if (conceded === 0) stats.cleanSheets++;

    stats.totalFinishings += getValue(
      isHome,
      match.homeFinishings,
      match.awayFinishings,
    );

    stats.totalFinishingsOnTarget += getValue(
      isHome,
      match.homeFinishingsOnTarget,
      match.awayFinishingsOnTarget,
    );

    stats.totalXG += getValue(isHome, match.homeXG, match.awayXG);

    stats.totalPossession += getValue(
      isHome,
      match.homePossession,
      match.awayPossession,
    );

    stats.totalPasses += getValue(isHome, match.homePasses, match.awayPasses);

    stats.totalPassesCompleted += getValue(
      isHome,
      match.homePassesCompleted,
      match.awayPassesCompleted,
    );

    stats.totalDefenses += getValue(
      isHome,
      match.homeDefenses,
      match.awayDefenses,
    );

    stats.totalYellowCards += getValue(
      isHome,
      match.homeYellowCards,
      match.awayYellowCards,
    );

    stats.totalRedCards += getValue(
      isHome,
      match.homeRedCards,
      match.awayRedCards,
    );

    stats.totalBallRecovery += getValue(
      isHome,
      match.homeBallRecovery,
      match.awayBallRecovery,
    );

    if (match.playerStats) {
      match.playerStats.forEach((p) => {
        stats.totalAssists += p.assists ?? 0;
        stats.totalDistance += p.distanceKm ?? 0;

        if (p.rating) {
          stats.totalRating += p.rating;
          stats.ratingCount++;
        }
      });
    }
  });

  return stats;
};
