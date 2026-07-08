import { TimelineEvent } from "../../types";
import { CuriositiesState } from "../createCuriositiesState";

interface AnalyzeTimelineParams {
  state: CuriositiesState;
  matchTimeline: TimelineEvent[];
  diff: number;
  myScore: number;
  oppScore: number;
  scoreText: string;
  opponentName: string;
  matchGoals1H: number;
  matchGoals2H: number;
  hasOverwhelmingStart: boolean;
  hasDramaticEnd: boolean;
}

export const analyzeTimeline = ({
  state,
  matchTimeline,
  diff,
  myScore,
  oppScore,
  scoreText,
  opponentName,
  matchGoals1H,
  matchGoals2H,
  hasOverwhelmingStart,
  hasDramaticEnd,
}: AnalyzeTimelineParams) => {
  if (matchGoals1H > 0 && matchGoals2H > 0) state.precisionMatchesCount++;
  if (hasOverwhelmingStart) state.overwhelmingStartsCount++;
  if (hasDramaticEnd) state.dramaticEndsCount++;

  if (matchTimeline.length === 0) return;

  const firstEvent = matchTimeline[0];
  let myCurrent = 0;
  let oppCurrent = 0;
  let maxDeficit = 0;
  let maxLead = 0;
  let wasLosing = false;

  if (firstEvent.isMine) {
    state.scoredFirstGamesCount++;
    if (diff >= 0) state.unbeatenWhenScoringFirstCount++;
    state.openerPlayers[firstEvent.player] =
      (state.openerPlayers[firstEvent.player] || 0) + 1;
  }

  matchTimeline.forEach((ev) => {
    if (ev.isMine) myCurrent++;
    else oppCurrent++;

    const currentDeficit = oppCurrent - myCurrent;
    if (currentDeficit > maxDeficit) maxDeficit = currentDeficit;
    if (-currentDeficit > maxLead) maxLead = -currentDeficit;
    if (currentDeficit > 0) wasLosing = true;
  });

  if (diff > 0 && wasLosing) state.comebackWinsCount++;

  if (diff > 0 && maxDeficit > state.biggestComebackWin.deficit) {
    state.biggestComebackWin = {
      deficit: maxDeficit,
      text: `${scoreText} (saiu perdendo por ${maxDeficit})`,
    };
  }

  if (diff < 0 && maxLead > state.biggestComebackLoss.lead) {
    state.biggestComebackLoss = {
      lead: maxLead,
      text: `${scoreText} (chegou a ganhar por ${maxLead})`,
    };
  }

  if (diff > 0) {
    const winningGoalIndex = oppScore;
    const myTimelineGoals = matchTimeline.filter((e) => e.isMine);

    if (myTimelineGoals[winningGoalIndex]) {
      const g = myTimelineGoals[winningGoalIndex];
      state.decisivePlayers[g.player] =
        (state.decisivePlayers[g.player] || 0) + 1;

      if (g.minute > state.latestWinGoal.min) {
        state.latestWinGoal = {
          min: g.minute,
          text: `${g.player} aos ${g.strMin}' vs ${opponentName}`,
        };
      }
    }
  }

  if (diff === 0 && myScore > 0) {
    const myTimelineGoals = matchTimeline.filter((e) => e.isMine);
    const lastGoal = myTimelineGoals[myTimelineGoals.length - 1];

    if (lastGoal && lastGoal.minute > state.latestDrawGoal.min) {
      state.latestDrawGoal = {
        min: lastGoal.minute,
        text: `${lastGoal.player} aos ${lastGoal.strMin}' vs ${opponentName}`,
      };
    }
  }
};
