import { useEffect, useMemo, useRef, useState } from "react";
import { getMatchFormFields } from "../../constants/MatchFormFields";
import { Teams } from "../../../../../../../../../common/interfaces/Teams";
import { useAddMatchesContext } from "../../contexts/context";
import { ServiceMatches } from "../../services/ServiceMatches";

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

  const localTeams = useMemo<Teams[]>(() => {
    const teamMap = new Map<string, Teams>();

    career?.clubData?.forEach((seasonData) => {
      seasonData.teams?.forEach((team) => {
        if (team.showMatch === false || !team.name) return;

        const normalizedName = team.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "");

        const key = `${normalizedName}-${team.leagueName ?? ""}`;

        if (!teamMap.has(key)) {
          teamMap.set(key, team);
        }
      });
    });

    return Array.from(teamMap.values());
  }, [career?.clubData]);

  const [globalTeamNames, setGlobalTeamNames] = useState<string[]>([]);

  useEffect(() => {
    let isActive = true;

    const fetchAllTeamsData = async () => {
      try {
        const globalTeams = await ServiceMatches.getAllTeamsAcrossUserCareers();

        if (isActive) {
          setGlobalTeamNames(globalTeams);
        }
      } catch (error) {
        console.error("Erro ao buscar times globais:", error);
      }
    };

    void fetchAllTeamsData();

    return () => {
      isActive = false;
    };
  }, []);

  const teamOptions = useMemo(() => {
    const localTeamNames = localTeams
      .filter(
        (team) => !formValues.league || team.leagueName === formValues.league,
      )
      .map((team) => team.name);

    const availableNames = formValues.league
      ? localTeamNames
      : [...localTeamNames, ...globalTeamNames];

    const searchValue = (formValues.opponentTeam ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    const uniqueTeams = new Map<string, string>();

    availableNames.forEach((teamName) => {
      const normalizedName = teamName.trim().toLowerCase().replace(/\s+/g, "");

      if (!normalizedName) return;
      if (searchValue && !normalizedName.includes(searchValue)) return;

      if (!uniqueTeams.has(normalizedName)) {
        uniqueTeams.set(normalizedName, teamName);
      }
    });

    return Array.from(uniqueTeams.values()).sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
  }, [localTeams, globalTeamNames, formValues.league, formValues.opponentTeam]);

  const formFields = useMemo(
    () => getMatchFormFields(leagueOptions, savedMonth, teamOptions),
    [leagueOptions, savedMonth, teamOptions],
  );

  return { formFields };
}
