import { useMemo } from "react";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { Match } from "../../../../../../common/interfaces/Match";
import { CuriositiesData } from "../../../../../../common/interfaces/Curiosities";
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

    const parseDateString = (dateStr: string) => {
      if (!dateStr) return 0;

      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];

        return new Date(`${year}-${parts[1]}-${parts[0]}T12:00:00Z`).getTime();
      }

      return new Date(dateStr).getTime();
    };

    const finishedMatches = matches
      .filter((m) => m.status === "FINISHED")
      .sort((a, b) => parseDateString(a.date) - parseDateString(b.date));

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
