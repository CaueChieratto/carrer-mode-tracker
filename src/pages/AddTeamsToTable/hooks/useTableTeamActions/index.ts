import { useState, useCallback } from "react";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { ServiceTable } from "../../services/ServiceTable";

interface UseTableTeamActionsParams {
  careerId: string;
  seasonId: string;
  teamId?: string;
  season: ClubData;
  formValues: Record<string, string>;
  onSuccess: () => void;
}

export function useTableTeamActions({
  careerId,
  seasonId,
  teamId,
  season,
  formValues,
  onSuccess,
}: UseTableTeamActionsParams) {
  const [isSaving, setIsSaving] = useState(false);

  const deleteTableTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      setIsSaving(true);
      await ServiceTable.deleteTeamFromTable(careerId, seasonId, teamId);
      onSuccess();
    } catch (error) {
      console.error("Erro ao deletar time da tabela: ", error);
      alert("Ocorreu um erro ao deletar os dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }, [careerId, seasonId, teamId, onSuccess]);

  const saveTableTeam = useCallback(async () => {
    if (!formValues.teamName) {
      alert("Por favor, selecione um time.");
      return;
    }

    const searchName = formValues.teamName.trim().toLowerCase();
    const existingTeam = season.teams?.find(
      (t) => t.name.trim().toLowerCase() === searchName,
    );

    if (!existingTeam) {
      alert("Por favor, selecione um time válido da lista.");
      return;
    }

    try {
      setIsSaving(true);

      const teamBadge = existingTeam.badge || "";
      const played = Number(formValues.played || 0);
      const won = Number(formValues.won || 0);
      const drawn = Number(formValues.drawn || 0);
      const lost = Number(formValues.lost || 0);
      const goalsFor = Number(formValues.goalsFor || 0);
      const goalsAgainst = Number(formValues.goalsAgainst || 0);
      const calculatedPoints = won * 3 + drawn * 1;

      const mapFormToZone = (val?: string) => {
        switch (val) {
          case "Campeão":
            return "first";
          case "Liga dos Campeões":
            return "champions";
          case "Liga Europeia":
            return "europa";
          case "Conference League":
            return "conference";
          case "Rebaixamento":
            return "relegation";
          default:
            return "default";
        }
      };

      const tableTeamData = {
        name: formValues.teamName,
        badge: teamBadge,
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDiff: goalsFor - goalsAgainst,
        points: calculatedPoints,
        customZone: mapFormToZone(formValues.customZone),
      };

      if (teamId) {
        await ServiceTable.updateTeamInTable(
          careerId,
          seasonId,
          teamId,
          tableTeamData,
        );
      } else {
        await ServiceTable.addTeamToTable(careerId, seasonId, tableTeamData);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar time na tabela: ", error);
      alert("Ocorreu um erro ao salvar os dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }, [careerId, seasonId, teamId, formValues, season, onSuccess]);

  return { isSaving, saveTableTeam, deleteTableTeam };
}
