import { useState, useCallback } from "react";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { buildMatchData } from "../../helpers/buildMatchData";
import { ServiceMatches } from "../../services/ServiceMatches";
import { validateMatchForm } from "../../validators/validateMatchForm";
import { MONTH_TO_NUM } from "../../../../layout/SectionView/features/ClubTabs/AllMatchesTab/constants/MONTH_OPTIONS";
import { buildTeamData } from "../../helpers/buildTeamData";
import { Teams } from "../../interface/teams";

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
    let finalDate = formValues.date;
    const savedMonth = localStorage.getItem("matchSelectedMonth") || "Tudo";

    if (savedMonth !== "Tudo" && finalDate && finalDate.length <= 2) {
      const monthNum = MONTH_TO_NUM[savedMonth].toString().padStart(2, "0");
      finalDate = `${finalDate}/${monthNum}`;
    }

    const validation = validateMatchForm({ ...formValues, date: finalDate });
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const isHomeMatch = booleanValues.isHomeMatch ?? false;

    const matchData = buildMatchData({
      ...formValues,
      date: finalDate,
      isHomeMatch,
      career,
      season,
      matchesId,
    });

    const opponentNameLower = formValues.opponentTeam.toLowerCase();

    // 1. Verifica se a equipa (nova ou atual) já está registada no array da temporada
    const teamAlreadyExistsInCurrentSeason = season.teams?.some(
      (team) => team.name.toLowerCase() === opponentNameLower,
    );

    let newTeamData: Teams | null = null;

    // 2. Se a equipa NÃO existe no array, vamos buscar os dados dela (independente de ser criação ou edição)
    if (!teamAlreadyExistsInCurrentSeason) {
      let teamFromPreviousSeasons: Teams | undefined;

      if (career.clubData) {
        for (const pastSeason of career.clubData) {
          const foundTeam = pastSeason.teams?.find(
            (t) => t.name.toLowerCase() === opponentNameLower,
          );
          if (foundTeam) {
            teamFromPreviousSeasons = foundTeam;
            break;
          }
        }
      }

      if (teamFromPreviousSeasons) {
        newTeamData = {
          name: formValues.opponentTeam, // Mantém a formatação do formulário
          badge: teamFromPreviousSeasons.badge || "",
        };

        if (!newTeamData.badge) {
          const fallbackData = await buildTeamData({
            opponentTeam: formValues.opponentTeam,
          });
          newTeamData.badge = fallbackData.badge;
        }
      } else {
        newTeamData = await buildTeamData({
          opponentTeam: formValues.opponentTeam,
        });
      }

      if (formValues.league) {
        newTeamData.leagueName = formValues.league;
      }
    }

    try {
      setIsSaving(true);

      // 3. Atualiza ou cria a partida
      if (matchesId) {
        await ServiceMatches.updateMatchInSeason(careerId, seasonId, matchData);
      } else {
        await ServiceMatches.addMatchToSeason(careerId, seasonId, matchData);
      }

      // 4. Se gerámos dados para uma equipa que faltava, adicionamos ao array (sem apagar as outras)
      if (newTeamData) {
        await ServiceMatches.addTeamToSeason(careerId, seasonId, newTeamData);
      }

      onSuccess();
    } catch (error) {
      console.error("Erro: ", error);
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

      // 1. Encontra os dados da partida antes de deletá-la para descobrir quem era o adversário
      const matchToDelete = season.matches?.find(
        (m) => m.matchesId === matchesId,
      );

      // 2. Deleta a partida
      await ServiceMatches.deleteMatchFromSeason(careerId, seasonId, matchesId);

      // 3. Lógica para remover o time do array da temporada (se for o último jogo contra ele)
      if (matchToDelete) {
        const opponentName =
          matchToDelete.homeTeam === career.clubName
            ? matchToDelete.awayTeam
            : matchToDelete.homeTeam;

        const hasOtherMatchesAgainstOpponent = season.matches?.some(
          (m) =>
            m.matchesId !== matchesId && // Ignora a partida que acabou de ser deletada
            (m.homeTeam === opponentName || m.awayTeam === opponentName),
        );

        // Se não existir nenhuma outra partida na temporada contra esse time, removemos ele da lista
        if (!hasOtherMatchesAgainstOpponent) {
          await ServiceMatches.removeTeamFromSeason(careerId, seasonId, {
            name: opponentName,
            badge: "", // O badge não é necessário para o filtro de remoção
          });
        }
      }

      onSuccess();
    } catch {
      alert("Erro ao excluir a partida. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }, [
    careerId,
    seasonId,
    matchesId,
    season?.matches,
    career?.clubName,
    onSuccess,
  ]);

  return { isSaving, saveMatch, deleteMatch };
}
