import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAcademyContext } from "../../../../../../../../../contexts/AcademyContext/hooks/useAcademyContext";
import { AcademyMatches } from "../../../../../../../../interfaces/AcademyTournaments/AcademyMatches/AcademyMatches";
import { getSeasonStartYear } from "../../../../../../../../utils/getSeasonStartYear";
import { MatchDataPayload } from "../../../../forms/types/MatchDataPayload";

export const useAcademyMatchMutations = (
  initialData?: Partial<AcademyMatches>,
  onMatchAdded?: () => void,
) => {
  const { career, seasonId, selectedTournament, onUpdateTournament } =
    useAcademyContext();
  const [formKey, setFormKey] = useState(0);

  const getRecalculatedStatus = (matches: AcademyMatches[]) => {
    let isFinished = false;
    let isChampion = false;
    let tournamentResult = "Em andamento";

    if (matches.length === 0 || matches.every((m) => m.result !== "FINISHED")) {
      tournamentResult = "Torneio Marcado";
    }

    for (const m of matches) {
      if (m.result !== "FINISHED") continue;
      const mStatus = m.status?.trim().toLowerCase() || "";
      const isFinalMatch = mStatus === "final";
      const isGroupStageMatch = mStatus === "fase de grupos";
      const uG = Number(m.userGoals) || 0;
      const oG = Number(m.opponentGoals) || 0;
      const isDefeat = uG < oG;
      const isVictory = uG > oG;

      if (isDefeat && !isGroupStageMatch) {
        isFinished = true;
        isChampion = false;
        tournamentResult = isFinalMatch ? "Vice-Campeão" : `Eliminado`;
        break;
      }

      if (isFinalMatch && isVictory) {
        isFinished = true;
        isChampion = true;
        tournamentResult = "Campeão";
        break;
      }
    }

    return { isFinished, isChampion, tournamentResult };
  };

  const handleSubmitMatch = async (data: MatchDataPayload) => {
    if (!selectedTournament || !onUpdateTournament) return;
    if (!data.opponentTeam || data.opponentTeam.trim() === "") {
      alert("Por favor, selecione um adversário.");
      return;
    }

    try {
      const [day, month] = data.date.split("/");
      const startYear = getSeasonStartYear(career, seasonId);
      const finalDate = `${day}/${month}/${startYear}`;

      let updatedMatches = [...(selectedTournament.matches || [])];

      if (initialData?.id) {
        updatedMatches = updatedMatches.map((match) =>
          match.id === initialData.id
            ? {
                ...match,
                date: finalDate,
                opponentTeam: data.opponentTeam,
                status: data.status,
              }
            : match,
        );
      } else {
        const newMatch: AcademyMatches = {
          id: uuidv4(),
          date: finalDate,
          opponentTeam: data.opponentTeam,
          status: data.status,
          userGoals: 0,
          opponentGoals: 0,
          lineup: [],
          result: "SCHEDULED",
        };
        updatedMatches.push(newMatch);
      }

      const newStatus = getRecalculatedStatus(updatedMatches);

      const updatedTournament = {
        ...selectedTournament,
        matches: updatedMatches,
        totalMatches: updatedMatches.length,
        ...newStatus,
      };

      await onUpdateTournament(updatedTournament, true);
      setFormKey((prev) => prev + 1);
      if (onMatchAdded) onMatchAdded();
    } catch (error) {
      console.error("Erro ao salvar partida:", error);
      alert("Falha ao salvar a partida. Tente novamente.");
    }
  };

  const handleDeleteMatch = async () => {
    if (!selectedTournament || !onUpdateTournament || !initialData?.id) return;

    try {
      const updatedMatches =
        selectedTournament.matches?.filter((m) => m.id !== initialData.id) ||
        [];

      const newStatus = getRecalculatedStatus(updatedMatches);

      const updatedTournament = {
        ...selectedTournament,
        matches: updatedMatches,
        totalMatches: updatedMatches.length,
        ...newStatus,
      };

      await onUpdateTournament(updatedTournament, true);
      if (onMatchAdded) onMatchAdded();
    } catch (error) {
      console.error("Erro ao deletar partida:", error);
      alert("Falha ao deletar a partida. Tente novamente.");
      throw error;
    }
  };

  return { formKey, handleSubmitMatch, handleDeleteMatch };
};
