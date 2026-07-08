import { CuriositiesState } from "../createCuriositiesState";

interface UpdateOpponentBasicStatsParams {
  state: CuriositiesState;
  opponentName: string;
  diff: number;
  myScore: number;
  oppScore: number;
  totalGoals: number;
  scoreText: string;
}

export const updateOpponentBasicStats = ({
  state,
  opponentName,
  diff,
  myScore,
  oppScore,
  totalGoals,
  scoreText,
}: UpdateOpponentBasicStatsParams) => {
  if (!state.opponentStats[opponentName]) {
    state.opponentStats[opponentName] = { wins: 0, losses: 0, games: 0 };
  }

  state.opponentStats[opponentName].games++;
  if (diff > 0) state.opponentStats[opponentName].wins++;
  if (diff < 0) state.opponentStats[opponentName].losses++;

  const scoreKey = `${myScore}x${oppScore}`;
  state.scoreFrequency[scoreKey] = (state.scoreFrequency[scoreKey] || 0) + 1;

  if (myScore > 0) {
    state.scoreFrequencyWhenScoring[scoreKey] =
      (state.scoreFrequencyWhenScoring[scoreKey] || 0) + 1;
  }

  if (totalGoals > state.craziestMatch.goals) {
    state.craziestMatch = { goals: totalGoals, text: scoreText };
  }
};
