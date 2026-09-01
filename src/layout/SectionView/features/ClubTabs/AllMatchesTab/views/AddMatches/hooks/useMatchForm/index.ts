import { useEffect, useMemo, useRef } from "react";
import { getMatchFormFields } from "../../constants/MatchFormFields";
import { Teams } from "../../../../../../../../../common/interfaces/Teams";
import { useAddMatchesContext } from "../../contexts/context";

export function useMatchForm() {
  const {
    matchesId,
    season,
    career,
    formValues,
    setFormValues,
    handleBooleanChange,
  } = useAddMatchesContext();

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
    if (!career?.clubData) return [];
    const teamMap = new Map<string, Teams>();
    career.clubData.forEach((season) => {
      season.teams?.forEach((t) => {
        if (t.showMatch === false) return;

        const key = `${t.name.toLowerCase().replace(/\s/g, "")}-${t.leagueName || ""}`;
        if (!teamMap.has(key)) {
          teamMap.set(key, t);
        }
      });
    });
    return Array.from(teamMap.values());
  }, [career]);

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

    return Array.from(new Set(filtered.map((t) => t.name)));
  }, [allTeams, formValues.league, formValues.opponentTeam]);

  const formFields = useMemo(
    () => getMatchFormFields(leagueOptions, savedMonth, teamOptions),
    [leagueOptions, savedMonth, teamOptions],
  );

  return { formFields };
}
