import { CuriositiesData } from "../../../../../../../common/interfaces/Curiosities";
import { Match } from "../../../../../../../common/interfaces/Match";
import { createCuriositiesState } from "./helpers/createCuriositiesState";
import { processMatch } from "./helpers/processsor";
import { buildHighlights, buildRankings } from "./utils/formatters";

export const buildCuriosities = (
  finishedMatches: Match[],
  clubName: string,
  getPlayerName: (id?: string) => string,
): CuriositiesData => {
  if (finishedMatches.length === 0) {
    return { highlights: [], rankings: null };
  }

  const state = createCuriositiesState();

  finishedMatches.forEach((match, index) => {
    processMatch(match, index, state, clubName, getPlayerName);
  });

  return {
    highlights: buildHighlights(state),
    rankings: buildRankings(state),
  };
};
