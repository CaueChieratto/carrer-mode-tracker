import { Match } from "../../AllMatchesTab/types/Match";
import {
  FILTERED_LEAGUE,
  CHAMPION_COLOR,
  DEFAULT_POSITION_COLOR,
} from "../constants";
import { TeamStats } from "../types";

const createEmptyStats = (name: string): TeamStats => ({
  name,
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
});

const getOrCreate = (
  statsMap: Map<string, TeamStats>,
  name: string,
): TeamStats => {
  if (!statsMap.has(name)) {
    statsMap.set(name, createEmptyStats(name));
  }
  return statsMap.get(name)!;
};

const applyGoals = (home: TeamStats, away: TeamStats, match: Match): void => {
  home.goalsFor += match.homeScore ?? 0;
  home.goalsAgainst += match.awayScore ?? 0;
  away.goalsFor += match.awayScore ?? 0;
  away.goalsAgainst += match.homeScore ?? 0;
};

const applyMatchResult = (
  home: TeamStats,
  away: TeamStats,
  match: Match,
): void => {
  const homeScore = match.homeScore ?? 0;
  const awayScore = match.awayScore ?? 0;

  home.played++;
  away.played++;

  applyGoals(home, away, match);

  if (homeScore > awayScore) {
    home.wins++;
    home.points += 3;
    away.losses++;
  } else if (homeScore < awayScore) {
    away.wins++;
    away.points += 3;
    home.losses++;
  } else {
    home.draws++;
    home.points += 1;
    away.draws++;
    away.points += 1;
  }
};

const sortByPointsThenDiff = (a: TeamStats, b: TeamStats): number => {
  if (b.points !== a.points) return b.points - a.points;
  const diffA = a.goalsFor - a.goalsAgainst;
  const diffB = b.goalsFor - b.goalsAgainst;
  return diffB - diffA;
};

export const buildLeagueTable = (matches: Match[]): TeamStats[] => {
  const statsMap = new Map<string, TeamStats>();

  matches
    .filter((m) => m.league === FILTERED_LEAGUE)
    .forEach((match) => {
      const home = getOrCreate(statsMap, match.homeTeam);
      const away = getOrCreate(statsMap, match.awayTeam);
      applyMatchResult(home, away, match);
    });

  return Array.from(statsMap.values()).sort(sortByPointsThenDiff);
};

export const getGoalDiffLabel = (
  goalsFor: number,
  goalsAgainst: number,
): string => {
  const diff = goalsFor - goalsAgainst;
  return diff > 0 ? `+${diff}` : `${diff}`;
};

export const getPositionColor = (position: number): string =>
  position === 1 ? CHAMPION_COLOR : DEFAULT_POSITION_COLOR;
