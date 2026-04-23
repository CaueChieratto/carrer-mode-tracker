import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Career } from "../../../../../../common/interfaces/Career";
import { ClubData } from "../../../../../../common/interfaces/club/clubData";
import { buildMatchStatsContent } from "../../helpers/buildMatchStatsContent";

export const useMatchStats = (career: Career, season: ClubData) => {
  const location = useLocation();
  const isGeralPage = location.pathname.includes("/Geral");

  const content = useMemo(
    () => buildMatchStatsContent(career, season, isGeralPage),
    [career, season, isGeralPage],
  );

  return { content };
};
