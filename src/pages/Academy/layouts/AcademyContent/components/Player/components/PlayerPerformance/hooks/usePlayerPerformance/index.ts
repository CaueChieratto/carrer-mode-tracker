import { useMemo } from "react";
import { calculatePlayerStats } from "../../helpers/calculatePlayerStats";
import { useAcademyContext } from "../../../../../../../contexts/AcademyContext/hooks/useAcademyContext";

export const usePlayerPerformance = () => {
  const { selectedPlayer, tournamentsAcademy } = useAcademyContext();

  const stats = useMemo(() => {
    return calculatePlayerStats(selectedPlayer, tournamentsAcademy);
  }, [selectedPlayer, tournamentsAcademy]);

  return {
    selectedPlayer,
    tournamentStats: stats.tournamentStats,
    totalStats: stats.totalStats,
  };
};
