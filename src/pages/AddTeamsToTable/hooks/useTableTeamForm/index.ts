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
  addedTeamNames?: string[];
}

export function useTableTeamForm({
  career,
  season,
  formValues,
  isEditing = false,
  addedTeamNames = [],
}: UseTableTeamFormParams) {
  const teamOptions = useMemo(() => {
    let options = season?.teams ? season.teams.map((t) => t.name) : [];

    if (
      career?.clubName &&
      !options.some(
        (name) =>
          name.trim().toLowerCase() === career.clubName.trim().toLowerCase(),
      )
    ) {
      options.push(career.clubName);
    }

    if (addedTeamNames.length > 0) {
      options = options.filter((name) => {
        const isCurrentEditingTeam = isEditing && name === formValues.teamName;
        return !addedTeamNames.includes(name) || isCurrentEditingTeam;
      });
    }

    if (formValues.teamName) {
      const searchValue = formValues.teamName.trim().toLowerCase();
      options = options.filter((name) =>
        name.toLowerCase().includes(searchValue),
      );
    }

    return options;
  }, [season, career, formValues.teamName, addedTeamNames, isEditing]);

  const hasSelectedTeam = useMemo(() => {
    if (!formValues.teamName) return false;
    const searchName = formValues.teamName.trim().toLowerCase();

    const allOptions = season?.teams ? season.teams.map((t) => t.name) : [];
    if (career?.clubName) allOptions.push(career.clubName);

    return allOptions.some((name) => name.trim().toLowerCase() === searchName);
  }, [formValues.teamName, season, career]);

  const formFields = useMemo(
    () => getTableTeamFormFields(teamOptions, hasSelectedTeam, isEditing),
    [teamOptions, hasSelectedTeam, isEditing],
  );

  return { formFields };
}
