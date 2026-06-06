import { useEffect, useMemo, useRef } from "react";
import { useForm } from "../../../../common/hooks/UseForm";
import { Career } from "../../../../common/interfaces/Career";
import { ClubData } from "../../../../common/interfaces/club/clubData";
import { getMatchFormFields } from "../../constants/MatchFormFields";
import { Teams } from "../../interface/teams";

type UseFormReturn = ReturnType<typeof useForm>;

interface UseMatchFormParams {
  matchesId?: string;
  season?: ClubData;
  career?: Career;
  formValues: Record<string, string>;
  setFormValues: UseFormReturn["setFormValues"];
  handleBooleanChange: UseFormReturn["handleBooleanChange"];
}

export function useMatchForm({
  matchesId,
  season,
  career,
  formValues,
  setFormValues,
  handleBooleanChange,
}: UseMatchFormParams) {
  const initializedMatchId = useRef<string | null>(null);

  const savedMonth = useMemo(() => {
    if (!season) return "Tudo";
    return localStorage.getItem(`matchSelectedMonth_${season.id}`) || "Tudo";
  }, [season]);

  useEffect(() => {
    if (!matchesId || !season || !career) return;

    if (initializedMatchId.current === matchesId) return;

    const matchToEdit = season.matches?.find((m) => m.matchesId === matchesId);
    if (!matchToEdit) return;

    const isHomeMatch = matchToEdit.homeTeam === career.clubName;
    const opponentTeam = isHomeMatch
      ? matchToEdit.awayTeam
      : matchToEdit.homeTeam;

    let initialDate = matchToEdit.date.substring(0, 5);
    if (savedMonth !== "Tudo") {
      initialDate = initialDate.substring(0, 2);
    }

    setFormValues({
      date: initialDate,
      league: matchToEdit.league,
      opponentTeam,
    });

    handleBooleanChange("isHomeMatch", isHomeMatch);

    initializedMatchId.current = matchesId;
  }, [
    matchesId,
    season,
    career,
    setFormValues,
    handleBooleanChange,
    savedMonth,
  ]);

  const leagueOptions = useMemo(
    () => season?.leagues?.map((l) => l.name) ?? [],
    [season],
  );

  const allTeams = useMemo(() => {
    if (!season || !season.teams) return [];

    const teamMap = new Map<string, Teams>();

    season.teams.forEach((t) => {
      teamMap.set(t.name.toLowerCase().replace(/\s/g, ""), t);
    });

    return Array.from(teamMap.values());
  }, [season]);

  const teamOptions = useMemo(() => {
    let filtered = allTeams;

    if (formValues.league) {
      filtered = filtered.filter((t) => t.leagueName === formValues.league);
    }

    const searchValue = (formValues.opponentTeam || "")
      .toLowerCase()
      .replace(/\s/g, "");
    if (searchValue) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().replace(/\s/g, "").includes(searchValue),
      );
    }

    return filtered.map((t) => t.name);
  }, [allTeams, formValues.league, formValues.opponentTeam]);

  const formFields = useMemo(
    () => getMatchFormFields(leagueOptions, savedMonth, teamOptions),
    [leagueOptions, savedMonth, teamOptions],
  );

  return { formFields };
}
