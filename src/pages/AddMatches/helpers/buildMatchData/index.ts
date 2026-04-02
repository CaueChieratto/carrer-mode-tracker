import { v4 as uuidv4 } from "uuid";
import { Career } from "../../../../common/interfaces/Career";
import { getSeasonDateRange } from "../../../../common/utils/GetSeasonDateRange";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Match } from "../../../../components/AllMatchesTab/types/Match";

interface BuildMatchDataParams {
  date: string;
  league: string;
  opponentTeam: string;
  isHomeMatch: boolean;
  career: Career;
  season: ClubData;
  matchesId?: string;
}

export function buildMatchData({
  date,
  league,
  opponentTeam,
  isHomeMatch,
  career,
  season,
  matchesId,
}: BuildMatchDataParams): Match {
  const { startDate, endDate } = getSeasonDateRange(
    season.seasonNumber,
    career.createdAt,
    career.nation,
  );

  const [dayStr, monthStr] = date.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);

  const matchMonthIndex = month - 1;
  const matchYear =
    matchMonthIndex < startDate.getMonth()
      ? endDate.getFullYear()
      : startDate.getFullYear();

  const formattedDate = `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${String(matchYear).slice(-2)}`;

  const homeTeam = isHomeMatch ? career.clubName : opponentTeam;
  const awayTeam = isHomeMatch ? opponentTeam : career.clubName;

  const existingMatch = matchesId
    ? season.matches?.find((m) => m.matchesId === matchesId)
    : null;

  return {
    matchesId: existingMatch?.matchesId ?? uuidv4(),
    date: formattedDate,
    league,
    homeTeam,
    awayTeam,
    status: existingMatch?.status ?? "SCHEDULED",
    result: existingMatch?.result ?? "?",
  };
}
