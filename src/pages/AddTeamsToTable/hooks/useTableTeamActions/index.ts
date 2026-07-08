import { useState, useCallback } from "react";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Career } from "../../../../common/interfaces/Career";
import { ServiceTable } from "../../services/ServiceTable";

interface UseTableTeamActionsParams {
  careerId: string;
  seasonId: string;
  teamId?: string;
  career: Career;
  season: ClubData;
  formValues: Record<string, string>;
  onSuccess: () => void;
}

export function useTableTeamActions({
  careerId,
  seasonId,
  teamId,
  career,
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

    const isCareerTeam = career?.clubName.trim().toLowerCase() === searchName;

    if (!existingTeam && !isCareerTeam) {
      alert("Por favor, selecione um time válido da lista.");
      return;
    }

    try {
      setIsSaving(true);

      let teamBadge = "";
      if (existingTeam) {
        teamBadge = existingTeam.badge || "";
      } else if (isCareerTeam) {
        teamBadge = career.teamBadge || "";
      }

      const played = Number(formValues.played || 0);
      const won = Number(formValues.won || 0);
      const drawn = Number(formValues.drawn || 0);
      const lost = Number(formValues.lost || 0);
      const goalsFor = Number(formValues.goalsFor || 0);
      const goalsAgainst = Number(formValues.goalsAgainst || 0);
      const calculatedPoints = won * 3 + drawn * 1;

      const mapFormToZone = (
        val?: string,
      ):
        | "first"
        | "champions"
        | "europa"
        | "conference"
        | "relegation"
        | "promotion"
        | "promotion_playoff"
        | "none"
        | "default" => {
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
          case "Acesso":
            return "promotion";
          case "Play-off para Promoção":
            return "promotion_playoff";
          case "Nenhuma":
            return "none";
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
  }, [careerId, seasonId, teamId, formValues, season, career, onSuccess]);

  return { isSaving, saveTableTeam, deleteTableTeam };
}
