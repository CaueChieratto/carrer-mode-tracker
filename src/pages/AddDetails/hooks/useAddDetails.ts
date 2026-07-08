import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useForm } from "../../../common/hooks/UseForm";
import { formatRating } from "../../../common/utils/FormatRating";
import { Field } from "../../../components/FormSection";
import { ServiceMatches } from "../../AddMatches/services/ServiceMatches";
import { ServiceTable } from "../../AddTeamsToTable/services/ServiceTable";
import { TableTeamData } from "../../../common/interfaces/TableTeamData";
import { useMatchData } from "../../Match/hooks/useMatchData";
import { buildFormFields } from "../helpers/buildFormFields";
import { buildInitialFormValues } from "./helpers/buildInitialFormValues";
import { buildMatchPayload } from "./helpers/buildMatchPayload";
import {
  getUpdatedTableTeamData,
  getNewTableTeamData,
} from "./helpers/calculateTableStats";
import { resolveCardConflicts } from "./helpers/resolveCardConflicts";
import { Match } from "../../../common/interfaces/Match";
import { leaguesByContinent } from "../../../common/utils/league";

export const useAddDetails = () => {
  const { career, season, match, loading, backMatch } = useMatchData();
  const [isSaving, setIsSaving] = useState(false);
  const {
    formValues,
    setFormValues,
    booleanValues,
    handleInputChange,
    handleBooleanChange,
  } = useForm();
  const initializedMatchId = useRef<string | null>(null);

  useEffect(() => {
    if (!match || !career || initializedMatchId.current === match.matchesId)
      return;

    const { initialFormValues, booleansToSet } = buildInitialFormValues(
      match,
      career.clubName,
    );

    setFormValues(initialFormValues);
    booleansToSet.forEach(({ key, value }) => handleBooleanChange(key, value));

    initializedMatchId.current = match.matchesId;
  }, [match, career, setFormValues, handleBooleanChange]);

  const handleLocalInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      field: Field,
    ) => {
      let value = e.target.value;
      if (field.id === "opponentMvpRating") {
        value = formatRating(value);
        setFormValues((prev) => ({ ...prev, [field.id]: value }));
        return;
      }
      handleInputChange(e, field);
    },
    [handleInputChange, setFormValues],
  );

  const handleLocalBooleanChange = useCallback(
    (fieldId: string, value: boolean) => {
      const { updates } = resolveCardConflicts(fieldId, value);
      updates.forEach(({ key, value }) => handleBooleanChange(key, value));
      handleBooleanChange(fieldId, value);
    },
    [handleBooleanChange],
  );

  const syncTeamStats = useCallback(
    async (
      teamName: string,
      goalsFor: number,
      goalsAgainst: number,
      result: "V" | "E" | "D" | "?",
      currentTable: TableTeamData[],
    ) => {
      if (!career || !season) return;

      const teamInTable = currentTable.find(
        (t) => t.name.trim().toLowerCase() === teamName.trim().toLowerCase(),
      );

      if (teamInTable) {
        const updatedData = getUpdatedTableTeamData(
          teamInTable,
          goalsFor,
          goalsAgainst,
          result,
        );
        await ServiceTable.updateTeamInTable(
          career.id,
          season.id,
          teamInTable.id,
          updatedData,
        );
      } else {
        const existingTeamInfo = season?.teams?.find(
          (t) => t.name === teamName,
        );
        const badge =
          existingTeamInfo?.badge ||
          (teamName === career.clubName ? career.teamBadge || "" : "");
        const newTeamData = getNewTableTeamData(
          teamName,
          goalsFor,
          goalsAgainst,
          result,
          badge,
        );
        await ServiceTable.addTeamToTable(career.id, season.id, newTeamData);
      }
    },
    [career, season],
  );

  const saveDetails = useCallback(async () => {
    if (!career || !season || !match) return;
    setIsSaving(true);
    try {
      const isUserHome = match.homeTeam === career.clubName;
      const { updatedMatch, userResult } = buildMatchPayload(
        match,
        formValues,
        booleanValues,
        isUserHome,
      );

      await ServiceMatches.updateMatchInSeason(
        career.id,
        season.id,
        updatedMatch as Match,
      );

      const matchLeagueName = match.league.trim().toLowerCase();

      const foundLeagueInDb = season.leagues?.find(
        (l) => l.name.trim().toLowerCase() === matchLeagueName,
      );

      let isLeagueMatch = foundLeagueInDb?.league === true;

      if (!isLeagueMatch) {
        const allStaticLeagues = Object.values(leaguesByContinent).flatMap(
          (continent) => Object.values(continent).flat(),
        );

        const foundStaticLeague = allStaticLeagues.find(
          (l) => l.name.trim().toLowerCase() === matchLeagueName,
        );

        isLeagueMatch = foundStaticLeague?.league === true;
      }

      if (isLeagueMatch && match.status !== "FINISHED") {
        const currentTable = await ServiceTable.getTableBySeason(
          career.id,
          season.id,
        );
        const opponentName = isUserHome ? match.awayTeam : match.homeTeam;
        const opponentResult =
          userResult === "V" ? "D" : userResult === "D" ? "V" : "E";

        const homeScoreNum = Number(formValues.homeScore) || 0;
        const awayScoreNum = Number(formValues.awayScore) || 0;
        const userScoreNum = isUserHome ? homeScoreNum : awayScoreNum;
        const opponentScoreNum = isUserHome ? awayScoreNum : homeScoreNum;

        await Promise.all([
          syncTeamStats(
            career.clubName,
            userScoreNum,
            opponentScoreNum,
            userResult,
            currentTable,
          ),
          syncTeamStats(
            opponentName,
            opponentScoreNum,
            userScoreNum,
            opponentResult,
            currentTable,
          ),
        ]);
      }
      backMatch();
    } finally {
      setIsSaving(false);
    }
  }, [
    formValues,
    booleanValues,
    match,
    career,
    season,
    backMatch,
    syncTeamStats,
  ]);

  const isUserHome = match?.homeTeam === career?.clubName;
  const opponentScore =
    Number(isUserHome ? formValues.awayScore : formValues.homeScore) || 0;
  const userScore =
    Number(isUserHome ? formValues.homeScore : formValues.awayScore) || 0;
  const opponentCardCount = Number(formValues.opponentCardCount) || 0;
  const opponentOwnGoalCount = Number(formValues.opponentOwnGoalCount) || 0;

  const opponentGoalOptions = useMemo(() => {
    return Array.from({ length: opponentScore }).map((_, i) => {
      const min = formValues[`opponentGoalMinute_${i}`];
      const player = formValues[`opponentGoalPlayer_${i}`];
      if (player && min) return `${player} - ${min}'`;
      if (player) return player;
      if (min) return `${min}'`;
      return `Gol ${i + 1}`;
    });
  }, [opponentScore, formValues]);

  const fields = useMemo(
    () =>
      buildFormFields(
        !!booleanValues.hasExtraTime,
        !!booleanValues.hasPenalties,
        opponentScore,
        opponentCardCount,
        opponentOwnGoalCount,
        userScore,
        opponentGoalOptions,
        booleanValues,
        match?.homeTeam,
        match?.awayTeam,
        formValues,
      ),
    [
      booleanValues,
      opponentScore,
      opponentCardCount,
      opponentGoalOptions,
      opponentOwnGoalCount,
      userScore,
      match?.homeTeam,
      match?.awayTeam,
      formValues,
    ],
  );

  return {
    loading,
    isSaving,
    career,
    match,
    fields,
    formValues,
    handleInputChange: handleLocalInputChange,
    handleBooleanChange: handleLocalBooleanChange,
    saveDetails,
    backMatch,
  };
};
