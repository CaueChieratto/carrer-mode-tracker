import { Match } from "../../../../components/AllMatchesTab/types/Match";

const calcAcc = (success?: number, total?: number): string => {
  return success !== undefined && total !== undefined && total > 0
    ? String(Math.round((success / total) * 100))
    : "";
};

const safeStr = (val: number | undefined | null): string =>
  val !== undefined && val !== null && !Number.isNaN(val) ? String(val) : "";

const formatSum = (val: number): string => (val > 0 ? String(val) : "");

export const buildInitialStats = (
  match: Match,
  isUserHome: boolean,
): Record<string, string> => {
  const stats = match.playerStats || [];

  const userFinishings = stats.reduce(
    (acc, s) => acc + (s.totalFinishings || 0),
    0,
  );
  const userFinishingsMissed = stats.reduce(
    (acc, s) => acc + (s.finishingsMissed || 0),
    0,
  );
  const userFinishingsOnTarget = Math.max(
    0,
    userFinishings - userFinishingsMissed,
  );

  const userPasses = stats.reduce((acc, s) => acc + (s.totalPasses || 0), 0);
  const userPassesMissed = stats.reduce(
    (acc, s) => acc + (s.passesMissed || 0),
    0,
  );
  const userPassesCompleted = Math.max(0, userPasses - userPassesMissed);

  const userBallRecovery = stats.reduce(
    (acc, s) => acc + (s.ballsRecovered || 0),
    0,
  );
  const userDefenses = stats.reduce((acc, s) => acc + (s.defenses || 0), 0);
  const userYellows = stats.reduce((acc, s) => acc + (s.yellowCard ? 1 : 0), 0);
  const userReds = stats.reduce((acc, s) => acc + (s.redCard ? 1 : 0), 0);

  const userShotAccuracy = calcAcc(userFinishingsOnTarget, userFinishings);
  const userPassAccuracy = calcAcc(userPassesCompleted, userPasses);
  const initialUserPoss = isUserHome
    ? match.homePossession
    : match.awayPossession;

  return {
    userPossession: safeStr(initialUserPoss),
    homeXG: safeStr(match.homeXG),
    awayXG: safeStr(match.awayXG),
    homeBallRecovery:
      safeStr(match.homeBallRecovery) ||
      (isUserHome ? formatSum(userBallRecovery) : ""),
    awayBallRecovery:
      safeStr(match.awayBallRecovery) ||
      (!isUserHome ? formatSum(userBallRecovery) : ""),
    homeFinishings:
      safeStr(match.homeFinishings) ||
      (isUserHome ? formatSum(userFinishings) : ""),
    awayFinishings:
      safeStr(match.awayFinishings) ||
      (!isUserHome ? formatSum(userFinishings) : ""),
    homeShotAccuracy:
      calcAcc(match.homeFinishingsOnTarget, match.homeFinishings) ||
      (isUserHome ? userShotAccuracy : ""),
    awayShotAccuracy:
      calcAcc(match.awayFinishingsOnTarget, match.awayFinishings) ||
      (!isUserHome ? userShotAccuracy : ""),
    homePasses:
      safeStr(match.homePasses) || (isUserHome ? formatSum(userPasses) : ""),
    awayPasses:
      safeStr(match.awayPasses) || (!isUserHome ? formatSum(userPasses) : ""),
    homePassAccuracy:
      calcAcc(match.homePassesCompleted, match.homePasses) ||
      (isUserHome ? userPassAccuracy : ""),
    awayPassAccuracy:
      calcAcc(match.awayPassesCompleted, match.awayPasses) ||
      (!isUserHome ? userPassAccuracy : ""),
    homeDefenses:
      safeStr(match.homeDefenses) ||
      (isUserHome ? formatSum(userDefenses) : ""),
    awayDefenses:
      safeStr(match.awayDefenses) ||
      (!isUserHome ? formatSum(userDefenses) : ""),
    homeYellowCards:
      safeStr(match.homeYellowCards) ||
      (isUserHome ? formatSum(userYellows) : ""),
    awayYellowCards:
      safeStr(match.awayYellowCards) ||
      (!isUserHome ? formatSum(userYellows) : ""),
    homeRedCards:
      safeStr(match.homeRedCards) || (isUserHome ? formatSum(userReds) : ""),
    awayRedCards:
      safeStr(match.awayRedCards) || (!isUserHome ? formatSum(userReds) : ""),
  };
};
