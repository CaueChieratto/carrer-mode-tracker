import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "../../../common/hooks/UseForm";
import { formatRating } from "../../../common/utils/FormatRating";
import { Field } from "../../../components/FormSection";
import { ServiceMatches } from "../../AddMatches/services/ServiceMatches";
import { useMatchData } from "../../Match/hooks/useMatchData";
import { buildPlayerStats } from "../helpers/buildPlayerStats";
import { getInitialFormValues } from "../helpers/getInitialFormValues";
import { FormFields } from "../constants/FormFields";
import { getSubstitutionData } from "../helpers/getSubstitutionData";

export const useAddMatchStatsPlayer = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const isInitialized = useRef(false);

  const { career, season, match, loading, backMatch } = useMatchData();

  const isPlayerInLineup = useMemo(() => {
    if (!match?.lineup || !playerId) return false;

    const ids = [
      match.lineup.goalkeeper?.playerId,
      ...(match.lineup.lines?.map((s) => s.playerId) || []),
      ...(match.lineup.bench?.map((s) => s.playerId) || []),
    ].filter(Boolean);

    return ids.includes(playerId);
  }, [match, playerId]);

  useEffect(() => {
    if (!loading && match && !isPlayerInLineup) {
      backMatch();
    }
  }, [loading, match, isPlayerInLineup, backMatch]);

  const {
    formValues,
    setFormValues,
    booleanValues,
    handleInputChange,
    handleKeyDown,
    handleKeyUp,
    handleBooleanChange,
  } = useForm();

  const player = useMemo(
    () => season?.players.find((p) => p.id === playerId),
    [season, playerId],
  );

  const isGoalkeeper = player?.position === "GOL" || player?.position === "GK";

  const subData = useMemo(() => {
    if (!match || !season || !player)
      return { isStarter: true, options: ["Nenhum"] };
    return getSubstitutionData(match, season, player);
  }, [match, season, player]);

  useEffect(() => {
    if (!match || !playerId || isInitialized.current || !isPlayerInLineup)
      return;

    const initialValues = getInitialFormValues(match, playerId);

    if (!initialValues) {
      isInitialized.current = true;
      return;
    }

    setFormValues(initialValues.values);
    handleBooleanChange("yellowCard", initialValues.booleans.yellowCard);
    handleBooleanChange("redCard", initialValues.booleans.redCard);

    isInitialized.current = true;
  }, [match, playerId, setFormValues, handleBooleanChange, isPlayerInLineup]);

  const handleLocalInputChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      field: Field,
    ) => {
      let value = e.target.value;

      if (field.id === "minutesPlayed") {
        value = value.replace(/\D/g, "").slice(0, 3);
        setFormValues((prev) => ({ ...prev, [field.id]: value }));
        return;
      }

      if (["rating", "xG", "xA"].includes(field.id)) {
        value = formatRating(value);
        setFormValues((prev) => ({ ...prev, [field.id]: value }));
        return;
      }

      if (field.id === "substituteIn") {
        let calculatedMinutes: string | undefined;

        if (value !== "Nenhum" && match?.playerStats && season?.players) {
          const outPlayer = season.players.find((p) => p.name === value);

          if (outPlayer) {
            const outPlayerStats = match.playerStats.find(
              (s) => s.playerId === outPlayer.id,
            );
            const outPlayerMinutes = outPlayerStats?.minutesPlayed || 0;

            const maxMatchMinutes = Math.max(
              90,
              ...match.playerStats.map((s) => s.minutesPlayed || 0),
            );

            if (outPlayerMinutes > 0) {
              calculatedMinutes = String(
                Math.max(0, maxMatchMinutes - outPlayerMinutes),
              );
            }
          }
        }

        setFormValues((prev) => ({
          ...prev,
          [field.id]: value,
          ...(calculatedMinutes !== undefined && {
            minutesPlayed: calculatedMinutes,
          }),
        }));
        return;
      }

      handleInputChange(e, field);
    },
    [handleInputChange, setFormValues, match, season],
  );

  const formFields = useMemo(
    () => FormFields(subData.options, subData.isStarter),
    [subData],
  );

  const savePlayerStats = useCallback(async () => {
    if (!career || !season || !match || !player) return;

    setIsSaving(true);

    try {
      const newStats = buildPlayerStats(player.id, formValues, booleanValues);
      const updatedStats = [...(match.playerStats || [])];

      const index = updatedStats.findIndex((s) => s.playerId === player.id);
      if (index >= 0) {
        updatedStats[index] = newStats;
      } else {
        updatedStats.push(newStats);
      }

      const maxMatchMinutes = Math.max(
        90,
        ...updatedStats.map((s) => s.minutesPlayed || 0),
      );

      const oldStats = match.playerStats?.find((s) => s.playerId === player.id);

      if (newStats.substituteIn !== oldStats?.substituteIn) {
        if (oldStats?.substituteIn && oldStats.substituteIn !== "Nenhum") {
          const oldCounterpart = season.players.find(
            (p) => p.name === oldStats.substituteIn,
          );
          if (oldCounterpart) {
            const oldIdx = updatedStats.findIndex(
              (s) => s.playerId === oldCounterpart.id,
            );
            if (oldIdx >= 0) {
              const { ...restOfStats } = updatedStats[oldIdx];
              updatedStats[oldIdx] = restOfStats;
            }
          }
        }
      }

      if (newStats.substituteIn && newStats.substituteIn !== "Nenhum") {
        const newCounterpart = season.players.find(
          (p) => p.name === newStats.substituteIn,
        );
        if (newCounterpart) {
          const newIdx = updatedStats.findIndex(
            (s) => s.playerId === newCounterpart.id,
          );

          const counterpartMinutes = Math.max(
            0,
            maxMatchMinutes - newStats.minutesPlayed,
          );

          if (newIdx >= 0) {
            updatedStats[newIdx] = {
              ...updatedStats[newIdx],
              substituteIn: player.name,
              minutesPlayed: counterpartMinutes,
            };
          } else {
            updatedStats.push({
              playerId: newCounterpart.id,
              minutesPlayed: counterpartMinutes,
              defenses: 0,
              goals: 0,
              assists: 0,
              distanceKm: 0,
              passes: 0,
              finishings: 0,
              rating: 0,
              yellowCard: false,
              redCard: false,
              cleanSheet: false,
              substituteIn: player.name,
            });
          }
        }
      }

      await ServiceMatches.updateMatchInSeason(career.id, season.id, {
        ...match,
        playerStats: updatedStats,
      });

      backMatch();
    } finally {
      setIsSaving(false);
    }
  }, [career, season, match, player, formValues, booleanValues, backMatch]);

  return {
    loading,
    isSaving,
    career,
    player,
    isGoalkeeper,
    formFields,
    formValues,
    isPlayerInLineup,
    handleBooleanChange,
    handleKeyDown,
    handleKeyUp,
    handleLocalInputChange,
    savePlayerStats,
    backMatch,
  };
};
