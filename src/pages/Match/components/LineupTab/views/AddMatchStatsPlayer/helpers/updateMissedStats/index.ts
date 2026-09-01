import type { PlayerStatsFormValues } from "../../types";

const calculateMissedValue = (
  total: string | number | undefined,
  precision: string | number | undefined,
): string => {
  if (!total || !precision) {
    return "";
  }

  return String(
    Math.max(
      0,
      Math.round(Number(total) - (Number(total) * Number(precision)) / 100),
    ),
  );
};

export const updateMissedStats = (
  values: PlayerStatsFormValues,
): PlayerStatsFormValues => {
  const updatedValues = { ...values };

  updatedValues.passesMissed = calculateMissedValue(
    updatedValues.totalPasses,
    updatedValues.passPrecision,
  );

  updatedValues.finishingsMissed = calculateMissedValue(
    updatedValues.totalFinishings,
    updatedValues.finishingPrecision,
  );

  updatedValues.dribblesMissed = calculateMissedValue(
    updatedValues.totalDribbles,
    updatedValues.dribblePrecision,
  );

  return updatedValues;
};
