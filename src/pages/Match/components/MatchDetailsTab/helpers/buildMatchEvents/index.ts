import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/types/Match";
import { MatchEvent, PeriodKey } from "../../types";
import { extractMVP } from "./helpers/extractMVP";
import { extractPlayerEvents } from "./helpers/extractPlayerEvents";
import { extractOpponentEvents } from "./helpers/extractOpponentEvents";

export const buildMatchEvents = (match: Match, season: ClubData) => {
  const { mvpPlayerName, mvpRating } = extractMVP(match, season);

  const { events: userEvents, goals: userGoalsList } = extractPlayerEvents(
    match,
    season,
  );
  const { events: opponentEvents, goals: opponentGoalsList } =
    extractOpponentEvents(match);

  const allEvents = [...userEvents, ...opponentEvents];
  const sortedEvents = allEvents.sort((a, b) => b.sortTime - a.sortTime);

  const eventsByPeriod: Record<PeriodKey, MatchEvent[]> = {
    PEN: sortedEvents.filter((e) => e.period === "PEN"),
    "2ET": sortedEvents.filter((e) => e.period === "2ET"),
    "1ET": sortedEvents.filter((e) => e.period === "1ET"),
    "2T": sortedEvents.filter((e) => e.period === "2T"),
    "1T": sortedEvents.filter((e) => e.period === "1T"),
  };

  const isFinished = match.status === "FINISHED";
  const stoppage1 = match.stoppage1T || 0;
  const stoppage2 = match.stoppage2T || 0;
  const stoppageET1 = match.stoppageET1 || 0;
  const stoppageET2 = match.stoppageET2 || 0;

  const periods: { key: PeriodKey; label: string; stoppage?: number }[] = [];

  if (eventsByPeriod["PEN"].length > 0) {
    periods.push({ key: "PEN", label: "Pênaltis" });
  }

  if (
    match.hasExtraTime ||
    eventsByPeriod["2ET"].length > 0 ||
    stoppageET2 > 0
  ) {
    periods.push({ key: "2ET", label: "2º PR", stoppage: stoppageET2 });
  }

  if (
    match.hasExtraTime ||
    eventsByPeriod["1ET"].length > 0 ||
    stoppageET1 > 0
  ) {
    periods.push({ key: "1ET", label: "1º PR", stoppage: stoppageET1 });
  }

  if (isFinished || eventsByPeriod["2T"].length > 0 || stoppage2 > 0) {
    periods.push({ key: "2T", label: "2º Tempo", stoppage: stoppage2 });
  }

  if (isFinished || eventsByPeriod["1T"].length > 0 || stoppage1 > 0) {
    periods.push({ key: "1T", label: "1º Tempo", stoppage: stoppage1 });
  }

  return {
    mvpPlayerName,
    mvpRating,
    eventsByPeriod,
    periods,
    userGoalsList: userGoalsList.sort((a, b) => a.sortTime - b.sortTime),
    opponentGoalsList: opponentGoalsList.sort(
      (a, b) => a.sortTime - b.sortTime,
    ),
  };
};
