import { MatchResult } from "../../../../../../../../../common/interfaces/MatchResult";
import { CuriositiesState } from "../createCuriositiesState";

interface UpdateStreaksParams {
  state: CuriositiesState;
  isHome: boolean;
  diff: number;
  myScore: number;
  oppScore: number;
  result?: MatchResult;
}

export const updateStreaks = ({
  state,
  isHome,
  diff,
  myScore,
  oppScore,
  result,
}: UpdateStreaksParams) => {
  const isWin =
    result === "V" || (result !== "D" && result !== "E" && diff > 0);
  const isLoss =
    result === "D" || (result !== "V" && result !== "E" && diff < 0);
  const isUnbeaten = result === "V" || result === "E" || (!isLoss && diff >= 0);

  if (isUnbeaten) {
    state.currentUnbeaten++;
    state.maxUnbeaten = Math.max(state.maxUnbeaten, state.currentUnbeaten);
  } else state.currentUnbeaten = 0;

  if (isLoss || result === "E" || (!isWin && diff <= 0)) {
    state.currentWinless++;
    state.maxWinless = Math.max(state.maxWinless, state.currentWinless);
  } else state.currentWinless = 0;

  if (isWin) {
    state.currentWinStreak++;
    state.maxWinStreak = Math.max(state.maxWinStreak, state.currentWinStreak);
  } else state.currentWinStreak = 0;

  if (isHome) {
    if (isUnbeaten) {
      state.currentHomeUnbeaten++;
      state.maxHomeUnbeaten = Math.max(
        state.maxHomeUnbeaten,
        state.currentHomeUnbeaten,
      );
    } else state.currentHomeUnbeaten = 0;
  } else {
    if (isUnbeaten) {
      state.currentAwayUnbeaten++;
      state.maxAwayUnbeaten = Math.max(
        state.maxAwayUnbeaten,
        state.currentAwayUnbeaten,
      );
    } else state.currentAwayUnbeaten = 0;
  }

  if (myScore > 0) {
    state.currentScoringStreak++;
    state.maxScoringStreak = Math.max(
      state.maxScoringStreak,
      state.currentScoringStreak,
    );
  } else state.currentScoringStreak = 0;

  if (oppScore === 0) {
    state.currentCleanSheetStreak++;
    state.maxCleanSheetStreak = Math.max(
      state.maxCleanSheetStreak,
      state.currentCleanSheetStreak,
    );
  } else state.currentCleanSheetStreak = 0;

  if (oppScore > 0) {
    state.currentConcedingStreak++;
    state.maxConcedingStreak = Math.max(
      state.maxConcedingStreak,
      state.currentConcedingStreak,
    );
  } else state.currentConcedingStreak = 0;
};
