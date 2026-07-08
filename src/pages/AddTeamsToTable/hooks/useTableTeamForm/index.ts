import { useMemo } from "react";
import { useForm } from "../../../../common/hooks/UseForm";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { getTableTeamFormFields } from "../../constants/TableTeamFormFields";

type UseFormReturn = ReturnType<typeof useForm>;

interface UseTableTeamFormParams {
  season?: ClubData;
  formValues: Record<string, string>;
  setFormValues: UseFormReturn["setFormValues"];
  isEditing?: boolean;
}

export function useTableTeamForm({
  season,
  formValues,
  isEditing = false,
}: UseTableTeamFormParams) {
  const teamOptions = useMemo(() => {
    if (!season?.teams) return [];
    return season.teams.map((t) => t.name);
  }, [season]);

  const hasSelectedTeam = useMemo(() => {
    if (!formValues.teamName) return false;
    const searchName = formValues.teamName.trim().toLowerCase();
    return teamOptions.some((name) => name.trim().toLowerCase() === searchName);
  }, [formValues.teamName, teamOptions]);

  const formFields = useMemo(
    () => getTableTeamFormFields(teamOptions, hasSelectedTeam, isEditing),
    [teamOptions, hasSelectedTeam, isEditing],
  );

  return { formFields };
}
