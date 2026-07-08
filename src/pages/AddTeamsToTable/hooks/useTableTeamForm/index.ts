import { useMemo } from "react";
import { useForm } from "../../../../common/hooks/UseForm";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { Career } from "../../../../common/interfaces/Career";
import { getTableTeamFormFields } from "../../constants/TableTeamFormFields";

type UseFormReturn = ReturnType<typeof useForm>;

interface UseTableTeamFormParams {
  career?: Career;
  season?: ClubData;
  formValues: Record<string, string>;
  setFormValues: UseFormReturn["setFormValues"];
  isEditing?: boolean;
}

export function useTableTeamForm({
  career,
  season,
  formValues,
  isEditing = false,
}: UseTableTeamFormParams) {
  const teamOptions = useMemo(() => {
    const options = season?.teams ? season.teams.map((t) => t.name) : [];

    if (
      career?.clubName &&
      !options.some(
        (name) =>
          name.trim().toLowerCase() === career.clubName.trim().toLowerCase(),
      )
    ) {
      options.push(career.clubName);
    }

    return options;
  }, [season, career]);

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
