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

    const teamAlreadyExistsInCurrentSeason = season.teams?.some(
      (team) => team.name.toLowerCase() === opponentNameLower,
    );

    let newTeamData: Teams | null = null;

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
          name: formValues.opponentTeam,
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

      if (matchesId) {
        await ServiceMatches.updateMatchInSeason(careerId, seasonId, matchData);
      } else {
        await ServiceMatches.addMatchToSeason(careerId, seasonId, matchData);
      }

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

      const matchToDelete = season.matches?.find(
        (m) => m.matchesId === matchesId,
      );

      await ServiceMatches.deleteMatchFromSeason(careerId, seasonId, matchesId);

      if (matchToDelete) {
        const opponentName =
          matchToDelete.homeTeam === career.clubName
            ? matchToDelete.awayTeam
            : matchToDelete.homeTeam;

        const hasOtherMatchesAgainstOpponent = season.matches?.some(
          (m) =>
            m.matchesId !== matchesId &&
            (m.homeTeam === opponentName || m.awayTeam === opponentName),
        );

        if (!hasOtherMatchesAgainstOpponent) {
          await ServiceMatches.removeTeamFromSeason(careerId, seasonId, {
            name: opponentName,
            badge: "",
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
