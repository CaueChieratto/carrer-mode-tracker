import { processPlayerStats } from "../processPlayerStats";
import { processOpponentEvents } from "../processOpponentEvents";
import { analyzeTimeline } from "../analyzeTimeline";
import { Match } from "../../../../../../../../../common/interfaces/Match";
import { CuriositiesState } from "../createCuriositiesState";

interface ProcessTimelineParams {
  m: Match;
  index: number;
  state: CuriositiesState;
  opponentName: string;
  getPlayerName: (id?: string) => string;
  diff: number;
  myScore: number;
  oppScore: number;
  scoreText: string;
}

export const processTimeline = ({
  m,
  index,
  state,
  opponentName,
  getPlayerName,
  diff,
  myScore,
  oppScore,
  scoreText,
}: ProcessTimelineParams) => {
  const {
    events: playerEvents,
    matchGoals1H,
    matchGoals2H,
    hasOverwhelmingStart,
  } = processPlayerStats({ m, state, opponentName, getPlayerName, diff });

  const { events: oppEvents, hasDramaticEnd } = processOpponentEvents({
    m,
    index,
    state,
  });

  const matchTimeline = [...playerEvents, ...oppEvents].sort(
    (a, b) => a.minute - b.minute,
  );

  analyzeTimeline({
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
  });
};
