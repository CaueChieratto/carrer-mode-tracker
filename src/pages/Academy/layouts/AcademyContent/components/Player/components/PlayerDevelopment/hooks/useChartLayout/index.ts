import { useMemo } from "react";
import { ChartDataPoint } from "../../types";
import {
  POSITION_GROUP_ORDER,
  SECTOR_ORDER,
} from "../../../../../../../../../../layout/SectionView/features/ClubTabs/SquadTab/helpers/sortPlayers";

export const useChartLayout = (
  chartData: ChartDataPoint[],
  currentAttribute: string,
  isNumeric: boolean,
) => {
  return useMemo(() => {
    const padding = { top: 35, bottom: 35, left: 75, right: 40 };
    const minDistanceBetweenPoints = 65;
    const pointsWidth =
      chartData.length > 1
        ? (chartData.length - 1) * minDistanceBetweenPoints
        : 0;

    const svgWidth = Math.max(320, padding.left + pointsWidth + padding.right);
    const svgHeight = 220;
    const innerWidth = svgWidth - padding.left - padding.right;
    const innerHeight = svgHeight - padding.top - padding.bottom;

    const numericValues = isNumeric
      ? chartData.map((d) => {
          const match = String(d.value).match(/\d+/);
          return match ? Number(match[0]) : 0;
        })
      : [];
    const minVal = isNumeric ? Math.min(...numericValues) : 0;
    const maxVal = isNumeric ? Math.max(...numericValues) : 0;
    let yMax = maxVal;
    let yMin = minVal;

    if (isNumeric) {
      const isStrict =
        currentAttribute === "overall" || currentAttribute === "potential";
      const defaultLimits: Record<string, number> = {
        overall: 99,
        potential: 99,
        age: 40,
        height: 200,
        weight: 100,
      };
      const defaultMax = defaultLimits[currentAttribute] || maxVal;
      if (isStrict) {
        yMax = 99;
      } else {
        yMax = Math.max(defaultMax, maxVal);
      }
      if (yMin === yMax) {
        yMin = yMax - 10;
      } else {
        yMin = minVal - (yMax - minVal) * 0.15;
      }
    }

    const rawCategories = Array.from(
      new Set(chartData.map((d) => String(d.value))),
    );

    const customLevels: Record<string, number> = {
      Ataque: 1,
      Atacantes: 1,
      Atacante: 1,
      Meia: 2,
      Meias: 2,
      "Meio-campo": 2,
      Defesa: 3,
      Defensores: 3,
      Defensor: 3,
      Goleiro: 4,
      Goleiros: 4,
    };

    const getLevel = (val: string) => {
      const safeVal = String(val).trim();

      if (customLevels[safeVal] !== undefined) {
        return customLevels[safeVal];
      }

      if (currentAttribute === "position") {
        return POSITION_GROUP_ORDER[safeVal] ?? 99;
      }

      if (currentAttribute === "sector") {
        const idx = SECTOR_ORDER.indexOf(safeVal);
        return idx !== -1 ? idx + 1 : 4;
      }

      return 1;
    };

    const isFixedSectorScale =
      !isNumeric &&
      (currentAttribute === "sector" ||
        rawCategories.some((cat) => customLevels[cat] !== undefined));

    const uniqueLevels = !isNumeric
      ? Array.from(new Set(rawCategories.map(getLevel))).sort((a, b) => a - b)
      : [];

    const getX = (index: number) => {
      if (chartData.length === 1) return padding.left + innerWidth / 2;
      return padding.left + (index / (chartData.length - 1)) * innerWidth;
    };

    const getY = (val: string | number) => {
      if (isNumeric) {
        const match = String(val).match(/\d+/);
        const numVal = match ? Number(match[0]) : 0;
        return (
          padding.top +
          innerHeight -
          ((numVal - yMin) / (yMax - yMin)) * innerHeight
        );
      } else {
        const level = getLevel(String(val));

        if (isFixedSectorScale) {
          const yRatio = (level - 1) / 3;
          return padding.top + yRatio * innerHeight;
        } else {
          const index = uniqueLevels.indexOf(level);
          const safeIndex = index !== -1 ? index : 0;
          const yRatio =
            uniqueLevels.length > 1
              ? safeIndex / (uniqueLevels.length - 1)
              : 0.5;
          return padding.top + yRatio * innerHeight;
        }
      }
    };

    const yAxisElements: { y: number; label: string | number }[] = [];

    if (isNumeric) {
      [0, 0.5, 1].forEach((ratio) => {
        const y = padding.top + innerHeight * ratio;
        let val: string | number = Math.round(yMax - (yMax - yMin) * ratio);
        if (ratio === 0 && currentAttribute === "potential" && val === 99) {
          val = "99";
        }
        yAxisElements.push({ y, label: val });
      });
    } else if (isFixedSectorScale) {
      const sectorLabels = [
        { level: 1, text: "Ataque" },
        { level: 2, text: "Meia" },
        { level: 3, text: "Defesa" },
        { level: 4, text: "Goleiro" },
      ];

      sectorLabels.forEach(({ level, text }) => {
        const yRatio = (level - 1) / 3;
        const y = padding.top + yRatio * innerHeight;
        yAxisElements.push({ y, label: text });
      });
    } else {
      uniqueLevels.forEach((level, index) => {
        const yRatio =
          uniqueLevels.length > 1 ? index / (uniqueLevels.length - 1) : 0.5;
        const y = padding.top + yRatio * innerHeight;
        const catsInLevel = rawCategories
          .filter((cat) => getLevel(cat) === level)
          .sort();
        yAxisElements.push({ y, label: catsInLevel.join(", ") });
      });
    }

    const linePoints = chartData
      .map((d, i) => `${getX(i)},${getY(d.value)}`)
      .join(" ");

    return {
      svgWidth,
      svgHeight,
      padding,
      yAxisElements,
      linePoints,
      getX,
      getY,
    };
  }, [chartData, currentAttribute, isNumeric]);
};
