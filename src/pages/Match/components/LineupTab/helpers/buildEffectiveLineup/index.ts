import type { ClubData } from "../../../../../../common/interfaces/club/clubData";
import type { Match } from "../../../../../../common/interfaces/Match";
import type { SavedLineup } from "../../../../../../common/interfaces/Lineup";

import { getLineupPlayerIds } from "../getLineupPlayerIds";

const parseMatchDate = (date: string): number => {
  if (!date) {
    return 0;
  }

  const [day, month, year] = date.split("/").map(Number);

  return new Date(2000 + year, month - 1, day).getTime();
};

const isLineupEmpty = (lineup?: SavedLineup | null): boolean =>
  getLineupPlayerIds(lineup).size === 0;

export const buildEffectiveLineup = (
  currentMatch: Match,
  seasonMatches: ClubData["matches"],
) => {
  if (!isLineupEmpty(currentMatch.lineup)) {
    return currentMatch.lineup;
  }

  const sortedMatches = [...(seasonMatches || [])].sort(
    (firstMatch, secondMatch) =>
      parseMatchDate(firstMatch.date) - parseMatchDate(secondMatch.date),
  );

  const currentMatchIndex = sortedMatches.findIndex(
    (match) => match.matchesId === currentMatch.matchesId,
  );

  if (currentMatchIndex <= 0) {
    return currentMatch.lineup;
  }

  for (let index = currentMatchIndex - 1; index >= 0; index--) {
    const previousMatch = sortedMatches[index];

    if (
      previousMatch &&
      previousMatch.league === currentMatch.league &&
      !isLineupEmpty(previousMatch.lineup)
    ) {
      return previousMatch.lineup;
    }
  }

  for (let index = currentMatchIndex - 1; index >= 0; index--) {
    const previousMatch = sortedMatches[index];

    if (previousMatch && !isLineupEmpty(previousMatch.lineup)) {
      return previousMatch.lineup;
    }
  }

  return currentMatch.lineup;
};
