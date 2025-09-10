import { useMemo } from "react";
import { useCareers } from "../../Career/UseCareer";

export const useSeasonData = (careerId?: string, seasonId?: string) => {
  const { careers, loading } = useCareers();

  const career = useMemo(
    () => (!loading ? careers.find((c) => c.id === careerId) : undefined),
    [careers, careerId, loading]
  );

  const season = useMemo(
    () => career?.clubData.find((s) => s.id === seasonId),
    [career, seasonId]
  );

  return { career, season, loading };
};
