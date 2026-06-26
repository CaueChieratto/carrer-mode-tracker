import { useMemo } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Match } from "../../AllMatchesTab/types/Match";
import { CuriositiesData } from "../types";
import { buildCuriosities } from "../helpers/buildCuriosities";

export const useCuriosities = (
  career: Career,
  season: ClubData,
  isGeralPage: boolean,
): CuriositiesData => {
  return useMemo(() => {
    const matches: Match[] = isGeralPage
      ? career.clubData.flatMap((s) => s.matches || [])
      : season.matches || [];

    const finishedMatches = matches.filter((m) => m.status === "FINISHED");

    if (finishedMatches.length === 0) {
      return { highlights: [], rankings: null };
    }

    const playerMap = new Map<string, string>();
    const seasons = isGeralPage ? career.clubData : [season];

    seasons.forEach((s) => {
      s.players?.forEach((p) => playerMap.set(p.id, p.name));
    });

    const getPlayerName = (id?: string) => {
      if (!id) return "Desconhecido";
      return playerMap.get(id) || id;
    };

    return buildCuriosities(finishedMatches, career.clubName, getPlayerName);
  }, [career, season, isGeralPage]);
};
