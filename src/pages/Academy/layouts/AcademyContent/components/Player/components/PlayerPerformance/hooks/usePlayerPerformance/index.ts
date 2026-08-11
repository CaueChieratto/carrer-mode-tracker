import { useMemo } from "react";
import { calculatePlayerStats } from "../../helpers/calculatePlayerStats";
import { useAcademyContext } from "../../../../../../../contexts/AcademyContext/hooks/useAcademyContext";

export const usePlayerPerformance = () => {
  const { selectedPlayer, tournamentsAcademy, career, isGeral, seasonNumber } =
    useAcademyContext();

  const stats = useMemo(() => {
    return calculatePlayerStats(
      selectedPlayer,
      tournamentsAcademy,
      career,
      seasonNumber,
      isGeral,
    );
  }, [selectedPlayer, tournamentsAcademy, career, seasonNumber, isGeral]);

  return {
    selectedPlayer,
    tournamentStats: stats.tournamentStats,
    totalStats: stats.totalStats,
    isGeral,
  };
};
