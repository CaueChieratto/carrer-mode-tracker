import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useForm } from "../../../common/hooks/UseForm";
import { ServiceMatches } from "../../AddMatches/services/ServiceMatches";
import { useMatchData } from "../../Match/hooks/useMatchData";
import { AddStatsMatchFormFields } from "../constants/FormFields";
import { buildInitialStats } from "../helpers/buildInitialStats";
import { buildMatchUpdate } from "../helpers/buildMatchUpdate";
import { Field } from "../../../components/FormSection";

export const useAddStatsMatch = () => {
  const { career, season, match, loading, backMatch } = useMatchData();
  const [isSaving, setIsSaving] = useState(false);
  const initializedMatchId = useRef<string | null>(null);

  const { formValues, setFormValues, handleInputChange } = useForm();

  const handleLocalInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      field: Field,
    ) => {
      let value = e.target.value;

      const percentageFields = [
        "userPossession",
        "homeShotAccuracy",
        "awayShotAccuracy",
        "homePassAccuracy",
        "awayPassAccuracy",
      ];

      if (percentageFields.includes(field.id)) {
        if (value !== "") {
          const numericValue = Number(value.replace(/\D/g, ""));
          value = String(Math.min(100, Math.max(0, numericValue)));
        }
        setFormValues((prev) => ({ ...prev, [field.id]: value }));
        return;
      }

      handleInputChange(e, field);
    },
    [handleInputChange, setFormValues],
  );

  const isUserHome = match?.homeTeam === career?.clubName;

  useEffect(() => {
    if (match && career && initializedMatchId.current !== match.matchesId) {
      const initial = buildInitialStats(match, isUserHome);
      setFormValues(initial);
      initializedMatchId.current = match.matchesId;
    }
  }, [match, career, isUserHome, setFormValues]);

  const saveStats = useCallback(async () => {
    if (!career || !season || !match) return;

    setIsSaving(true);
    try {
      const matchToSave = buildMatchUpdate(formValues, match, isUserHome);

      ServiceMatches.updateMatchInSeason(career.id, season.id, matchToSave);

      backMatch();
    } finally {
      setIsSaving(false);
    }
  }, [formValues, match, career, season, isUserHome, backMatch]);

  const fields = useMemo(
    () =>
      AddStatsMatchFormFields(
        match?.homeTeam || "Mandante",
        match?.awayTeam || "Visitante",
        isUserHome,
      ),
    [match, isUserHome],
  );

  return {
    loading,
    isSaving,
    career,
    match,
    fields,
    formValues,
    handleInputChange: handleLocalInputChange,
    saveStats,
    backMatch,
  };
};
