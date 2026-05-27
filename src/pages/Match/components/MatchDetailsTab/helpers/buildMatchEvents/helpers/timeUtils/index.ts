import { Match } from "../../../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { PeriodKey } from "../../../../types";

export const getEventDetails = (t: number, match: Match) => {
  let period: PeriodKey = "1T";

  const stoppage1 = match.stoppage1T || 0;
  const stoppage2 = match.stoppage2T || 0;
  const stoppageET1 = match.stoppageET1 || 0;

  if (match.hasExtraTime) {
    if (t > 105 + stoppageET1) {
      period = "2ET";
    } else if (t > 90 + stoppage2) {
      period = "1ET";
    } else if (t > 45 + stoppage1) {
      period = "2T";
    }
  } else {
    if (t > 45 + stoppage1) {
      period = "2T";
    }
  }

  let displayTime = `${t}'`;
  let sortTime = t;

  if (period === "1T") {
    if (t > 45) displayTime = `45' +${t - 45}`;
    sortTime = t;
  } else if (period === "2T") {
    if (t > 90) displayTime = `90' +${t - 90}`;
    sortTime = 100 + t;
  } else if (period === "1ET") {
    if (t > 105) displayTime = `105' +${t - 105}`;
    sortTime = 200 + t;
  } else if (period === "2ET") {
    if (t > 120) displayTime = `120' +${t - 120}`;
    sortTime = 300 + t;
  } else if (period === "PEN") {
    sortTime = 400 + t;
  }

  return { period, displayTime, sortTime };
};

export const parseGoals = (minutes: number[], match: Match) => {
  const result: {
    time: number;
    period: PeriodKey;
    displayTime: string;
    sortTime: number;
  }[] = [];

  let currentPeriod: PeriodKey = "1T";
  let lastTime = -1;

  const stoppage1 = match.stoppage1T || 0;
  const stoppage2 = match.stoppage2T || 0;
  const stoppageET1 = match.stoppageET1 || 0;

  for (let i = 0; i < minutes.length; i++) {
    const t = minutes[i];
    if (t < lastTime) {
      if (currentPeriod === "1T") currentPeriod = "2T";
      else if (currentPeriod === "2T") currentPeriod = "1ET";
      else if (currentPeriod === "1ET") currentPeriod = "2ET";
    } else {
      if (currentPeriod === "1T" && t > 45 + stoppage1) currentPeriod = "2T";
      if (currentPeriod === "2T" && t > 90 + stoppage2) currentPeriod = "1ET";
      if (currentPeriod === "1ET" && t > 105 + stoppageET1)
        currentPeriod = "2ET";
    }

    const { displayTime, sortTime } = getEventDetails(t, match);
    result.push({ time: t, period: currentPeriod, displayTime, sortTime });
    lastTime = t;
  }

  return result;
};
