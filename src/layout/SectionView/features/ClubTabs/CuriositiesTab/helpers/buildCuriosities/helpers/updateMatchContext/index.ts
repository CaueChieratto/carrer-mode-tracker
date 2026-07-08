import { Match } from "../../../../../../../../../common/interfaces/Match";
import { CuriositiesState } from "../createCuriositiesState";

interface UpdateMatchContextParams {
  state: CuriositiesState;
  m: Match;
  isHome: boolean;
  opponentName: string;
  diff: number;
  myScore: number;
  oppScore: number;
  scoreText: string;
}

export const updateMatchContext = ({
  state,
  m,
  isHome,
  opponentName,
  diff,
  myScore,
  oppScore,
  scoreText,
}: UpdateMatchContextParams) => {
  if (myScore >= 3) state.explosiveMatchesCount++;
  if (myScore === 0) state.blankMatchesCount++;

  state.opponentGoalsScored[opponentName] =
    (state.opponentGoalsScored[opponentName] || 0) + myScore;
  state.opponentTeamsScorers[opponentName] =
    (state.opponentTeamsScorers[opponentName] || 0) + oppScore;

  if (diff > 0) {
    state.punchingBagDiffs[opponentName] =
      (state.punchingBagDiffs[opponentName] || 0) + diff;
  }

  if (diff === 0) {
    state.drawsByOpponent[opponentName] =
      (state.drawsByOpponent[opponentName] || 0) + 1;
  }

  if (diff > state.biggestWin.diff) {
    state.biggestWin = { diff, text: scoreText };
  }

  if (diff < state.worstLoss.diff) {
    state.worstLoss = { diff, text: scoreText };
  }

  const myPossession = isHome ? m.homePossession || 0 : m.awayPossession || 0;
  if (myPossession > state.highestPossession.val) {
    state.highestPossession = {
      val: myPossession,
      text: `${myPossession}% vs ${opponentName}`,
    };
  }
};
