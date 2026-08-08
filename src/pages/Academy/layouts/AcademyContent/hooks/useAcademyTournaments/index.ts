import { useState, useCallback, useEffect } from "react";
import { AcademyService } from "../../services/AcademyService";
import { AcademyTournaments } from "../../interfaces/AcademyTournaments/AcademyTournaments";

export const useAcademyTournaments = (careerId: string, seasonId: string) => {
  const [tournamentsAcademy, setTournamentsAcademy] = useState<
    AcademyTournaments[]
  >([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);

  const fetchTournaments = useCallback(async () => {
    setIsLoadingTournaments(true);
    try {
      const data = await AcademyService.getTournamentsAcademy(
        careerId,
        seasonId,
      );
      setTournamentsAcademy(data);
    } catch (error) {
      console.error("Erro ao carregar torneios da academia:", error);
    } finally {
      setIsLoadingTournaments(false);
    }
  }, [careerId, seasonId]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return {
    tournamentsAcademy,
    isLoadingTournaments,
    setTournamentsAcademy,
    refetchTournaments: fetchTournaments,
  };
};
