import { useState } from "react";
import Styles from "./DevelopmentChart.module.css";
import { ChartDataPoint } from "../../types";
import { useChartLayout } from "../../hooks/useChartLayout";
import { ChartSvg } from "../ChartSvg";
import { ChartTooltip } from "../ChartTooltip";

interface DevelopmentChartProps {
  chartData: ChartDataPoint[];
  currentAttribute: string;
  isNumeric: boolean;
}

export const DevelopmentChart = ({
  chartData,
  currentAttribute,
  isNumeric,
}: DevelopmentChartProps) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const {
    svgWidth,
    svgHeight,
    padding,
    yAxisElements,
    linePoints,
    getX,
    getY,
  } = useChartLayout(chartData, currentAttribute, isNumeric);

  return (
    <div className={Styles.chartWrapper} onClick={() => setActiveTooltip(null)}>
      <div className={Styles.scrollableArea}>
        <div
          className={Styles.svgWrapper}
          style={{ width: svgWidth, height: svgHeight }}
        >
          <ChartSvg
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            padding={padding}
            yAxisElements={yAxisElements}
            linePoints={linePoints}
            chartData={chartData}
            activeTooltip={activeTooltip}
            getX={getX}
            getY={getY}
            onPointClick={setActiveTooltip}
          />
        </div>
      </div>

      {activeTooltip !== null && chartData[activeTooltip] && (
        <ChartTooltip
          data={chartData[activeTooltip]}
          currentAttribute={currentAttribute}
          onClose={() => setActiveTooltip(null)}
        />
      )}
    </div>
  );
};
