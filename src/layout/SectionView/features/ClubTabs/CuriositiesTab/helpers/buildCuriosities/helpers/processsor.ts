import { Match } from "../../../../../../../../common/interfaces/Match";
import { CuriositiesState } from "./createCuriositiesState";
import { processTimeline } from "./processTimeline";
import { updateMatchContext } from "./updateMatchContext";
import { updateOpponentBasicStats } from "./updateOpponentBasicStats";
import { updateStreaks } from "./updateStreaks";

export const processMatch = (
  m: Match,
  index: number,
  state: CuriositiesState,
  clubName: string,
  getPlayerName: (id?: string) => string,
) => {
  const isHome = m.homeTeam === clubName;
  const opponentName = isHome ? m.awayTeam : m.homeTeam;
  const myScore = isHome ? m.homeScore || 0 : m.awayScore || 0;
  const oppScore = isHome ? m.awayScore || 0 : m.homeScore || 0;
  const diff = myScore - oppScore;
  const scoreText = `${myScore}x${oppScore} vs ${opponentName}`;
  const totalGoals = myScore + oppScore;

  updateOpponentBasicStats({
    state,
    opponentName,
    diff,
    myScore,
    oppScore,
    totalGoals,
    scoreText,
  });

  updateStreaks({ state, isHome, diff, myScore, oppScore, result: m.result });

  updateMatchContext({
    state,
    m,
    isHome,
    opponentName,
    diff,
    myScore,
    oppScore,
    scoreText,
  });

  processTimeline({
    m,
    index,
    state,
    opponentName,
    getPlayerName,
    diff,
    myScore,
    oppScore,
    scoreText,
  });
};
