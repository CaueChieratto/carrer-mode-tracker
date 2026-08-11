import { useState, useCallback, useEffect } from "react";
import { AcademyService } from "../../services/AcademyService";
import { AcademyTournaments } from "../../interfaces/AcademyTournaments/AcademyTournaments";
import { Career } from "../../../../../../common/interfaces/Career";

export const useAcademyTournaments = (
  career: Career,
  seasonId: string,
  isGeral?: boolean,
) => {
  const [tournamentsAcademy, setTournamentsAcademy] = useState<
    AcademyTournaments[]
  >([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);

  const fetchTournaments = useCallback(
    async (isSilentUpdate = false) => {
      if (!isSilentUpdate) {
        setIsLoadingTournaments(true);
      }
      try {
        if (isGeral) {
          const promises = career.clubData.map((season) =>
            AcademyService.getTournamentsAcademy(career.id, season.id),
          );
          const results = await Promise.all(promises);
          const allTournaments = results.flat();
          setTournamentsAcademy(allTournaments);
        } else {
          const data = await AcademyService.getTournamentsAcademy(
            career.id,
            seasonId,
          );
          setTournamentsAcademy(data);
        }
      } catch (error) {
        console.error("Erro ao carregar torneios da academia:", error);
      } finally {
        setIsLoadingTournaments(false);
      }
    },
    [career, seasonId, isGeral],
  );

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
