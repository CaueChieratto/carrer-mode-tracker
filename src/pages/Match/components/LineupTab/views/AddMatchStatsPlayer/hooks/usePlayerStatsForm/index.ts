import { useRef, useEffect, useCallback, useMemo } from "react";
import { useForm } from "../../../../../../../../common/hooks/UseForm";
import { formatRating } from "../../../../../../../../common/utils/FormatRating";
import { Field } from "../../../../../../../../components/FormSection";
import { FormFields } from "../../constants/FormFields";
import { calculateSubstituteMinutes } from "../../helpers/calculateSubstitutionMinutes";
import { getInitialFormValues } from "../../helpers/getInitialFormValues";
import { updateMissedStats } from "../../helpers/updateMissedStats";
import { PlayerStatsFormProps, PlayerStatsInputEvent } from "../../types";

const PERCENTAGE_FIELD_IDS: readonly string[] = [
  "passPrecision",
  "finishingPrecision",
  "dribblePrecision",
];

const RATING_FIELD_IDS: readonly string[] = ["rating", "xG", "xA"];

const PRECISION_FIELD_IDS: readonly string[] = [
  "totalPasses",
  "passPrecision",
  "totalFinishings",
  "finishingPrecision",
  "totalDribbles",
  "dribblePrecision",
];

export const usePlayerStatsForm = ({
  match,
  season,
  playerId,
  playerIsInLineup,
  substitutionData,
  availableGoalsForAssist,
}: PlayerStatsFormProps) => {
  const {
    formValues,
    setFormValues,
    booleanValues,
    handleInputChange,
    handleKeyDown,
    handleKeyUp,
    handleBooleanChange,
  } = useForm();

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!match || !playerId || isInitialized.current || !playerIsInLineup) {
      return;
    }

    const initialValues = getInitialFormValues(match, playerId);

    if (!initialValues) {
      isInitialized.current = true;
      return;
    }

    setFormValues(initialValues.values);

    handleBooleanChange("yellowCard", initialValues.booleans.yellowCard);

    handleBooleanChange(
      "secondYellowCard",
      initialValues.booleans.secondYellowCard,
    );

    handleBooleanChange("redCard", initialValues.booleans.redCard);

    isInitialized.current = true;
  }, [match, playerId, setFormValues, handleBooleanChange, playerIsInLineup]);

  const handleLocalInputChange = useCallback(
    (event: PlayerStatsInputEvent, field: Field) => {
      let value = event.target.value;

      if (PERCENTAGE_FIELD_IDS.includes(field.id)) {
        if (value !== "") {
          const numericValue = Number(value.replace(/\D/g, ""));

          value = String(Math.min(100, Math.max(0, numericValue)));
        }
      }

      if (field.id === "minutesPlayed") {
        value = value.replace(/\D/g, "").slice(0, 3);

        setFormValues((previousValues) => ({
          ...previousValues,
          [field.id]: value,
        }));

        return;
      }

      if (RATING_FIELD_IDS.includes(field.id)) {
        value = formatRating(value);

        setFormValues((previousValues) => ({
          ...previousValues,
          [field.id]: value,
        }));

        return;
      }

      if (PRECISION_FIELD_IDS.includes(field.id)) {
        setFormValues((previousValues) =>
          updateMissedStats({
            ...previousValues,
            [field.id]: value,
          }),
        );

        return;
      }

      if (field.id === "substituteIn") {
        const calculatedMinutes = calculateSubstituteMinutes({
          value,
          currentMinutes: formValues.minutesPlayed,
          playerId,
          match,
          playerStats: match.playerStats,
          players: season.players,
        });

        setFormValues((previousValues) => ({
          ...previousValues,
          [field.id]: value,
          ...(calculatedMinutes !== undefined && {
            minutesPlayed: calculatedMinutes,
          }),
        }));

        return;
      }

      handleInputChange(event, field);
    },
    [handleInputChange, setFormValues, match, season, formValues, playerId],
  );

  const handleLocalBooleanChange = useCallback(
    (fieldId: string, value: boolean) => {
      if (fieldId === "secondYellowCard" && value) {
        handleBooleanChange("redCard", false);
      }

      if (fieldId === "redCard" && value) {
        handleBooleanChange("secondYellowCard", false);
      }

      if (fieldId === "yellowCard" && !value) {
        handleBooleanChange("secondYellowCard", false);
      }

      handleBooleanChange(fieldId, value);
    },
    [handleBooleanChange],
  );

  const matchGoalsCount = Number(formValues.matchGoals) || 0;

  const assistsCount = Number(formValues.assists) || 0;

  const ownGoalsCount = Number(formValues.ownGoals) || 0;

  const hasYellowCard = booleanValues.yellowCard || false;

  const hasSecondYellowCard = booleanValues.secondYellowCard || false;

  const hasRedCard = booleanValues.redCard || false;

  const formFields = useMemo(
    () =>
      FormFields(
        substitutionData.options,
        substitutionData.isStarter,
        matchGoalsCount,
        assistsCount,
        availableGoalsForAssist,
        ownGoalsCount,
        hasYellowCard,
        hasSecondYellowCard,
        hasRedCard,
        formValues,
      ),
    [
      substitutionData,
      matchGoalsCount,
      assistsCount,
      availableGoalsForAssist,
      ownGoalsCount,
      hasYellowCard,
      hasSecondYellowCard,
      hasRedCard,
      formValues,
    ],
  );

  return {
    formValues,
    booleanValues,
    formFields,
    handleLocalBooleanChange,
    handleKeyDown,
    handleKeyUp,
    handleLocalInputChange,
  };
};
