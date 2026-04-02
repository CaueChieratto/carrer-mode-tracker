import { useState, useCallback } from "react";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { buildMatchData } from "../../helpers/buildMatchData";
import { ServiceMatches } from "../../services/ServiceMatches";
import { validateMatchForm } from "../../validators/validateMatchForm";

interface UseMatchActionsParams {
  careerId: string;
  seasonId: string;
  matchesId?: string;
  career: Career;
  season: ClubData;
  formValues: { date: string; league: string; opponentTeam: string };
  booleanValues: Record<string, boolean | undefined>;
  onSuccess: () => void;
}

export function useMatchActions({
  careerId,
  seasonId,
  matchesId,
  career,
  season,
  formValues,
  booleanValues,
  onSuccess,
}: UseMatchActionsParams) {
  const [isSaving, setIsSaving] = useState(false);

  const saveMatch = useCallback(async () => {
    const validation = validateMatchForm(formValues);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const isHomeMatch = booleanValues.isHomeMatch ?? false;

    const matchData = buildMatchData({
      ...formValues,
      isHomeMatch,
      career,
      season,
      matchesId,
    });

    try {
      setIsSaving(true);

      if (matchesId) {
        await ServiceMatches.updateMatchInSeason(careerId, seasonId, matchData);
      } else {
        await ServiceMatches.addMatchToSeason(careerId, seasonId, matchData);
      }

      onSuccess();
    } catch {
      alert("Ocorreu um erro ao salvar a partida. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }, [
    careerId,
    seasonId,
    matchesId,
    career,
    season,
    formValues,
    booleanValues,
    onSuccess,
  ]);

  const deleteMatch = useCallback(async () => {
    if (!matchesId) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja deletar esta partida?",
    );
    if (!confirmed) return;

    try {
      setIsSaving(true);
      await ServiceMatches.deleteMatchFromSeason(careerId, seasonId, matchesId);
      onSuccess();
    } catch {
      alert("Erro ao excluir a partida. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }, [careerId, seasonId, matchesId, onSuccess]);

  return { isSaving, saveMatch, deleteMatch };
}
