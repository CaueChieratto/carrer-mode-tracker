import { useState, useEffect, useCallback } from "react";
import { EditableTeam } from "../../types";
import {
  fetchAllTeamsFromCareers,
  processTeamAction,
} from "../../services/EditTeamsService";

export const useEditTeams = () => {
  const [teams, setTeams] = useState<EditableTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTeamId, setSavingTeamId] = useState<string | null>(null);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const loadedTeams = await fetchAllTeamsFromCareers();
        setTeams(loadedTeams);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  const handleNameChange = useCallback(
    (originalName: string, newName: string) => {
      setTeams((prev) =>
        prev.map((t) =>
          t.originalName === originalName ? { ...t, name: newName } : t,
        ),
      );
    },
    [],
  );

  const handleFileChange = useCallback(
    (originalName: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        const previewUrl = URL.createObjectURL(selectedFile);
        setTeams((prev) =>
          prev.map((t) =>
            t.originalName === originalName
              ? { ...t, file: selectedFile, previewUrl }
              : t,
          ),
        );
      }
    },
    [],
  );

  const handleActionTeam = async (team: EditableTeam, isDeleting = false) => {
    if (isDeleting) {
      const confirmDelete = window.confirm(
        `Deseja realmente excluir o time "${team.name}" de todas as carreiras?`,
      );
      if (!confirmDelete) return;
    }

    setSavingTeamId(team.originalName);

    try {
      const finalBadgeUrl = await processTeamAction(team, isDeleting);

      if (isDeleting) {
        setTeams((prev) =>
          prev.filter((t) => t.originalName !== team.originalName),
        );
      } else {
        setTeams((prev) =>
          prev.map((t) =>
            t.originalName === team.originalName
              ? {
                  ...t,
                  originalName: team.name,
                  originalBadge: finalBadgeUrl || "",
                  badge: finalBadgeUrl,
                  file: undefined,
                  previewUrl: undefined,
                }
              : t,
          ),
        );
      }
    } catch {
      alert("Ocorreu um erro ao salvar este time.");
    } finally {
      setSavingTeamId(null);
    }
  };

  return {
    teams,
    loading,
    savingTeamId,
    handleNameChange,
    handleFileChange,
    handleActionTeam,
  };
};
