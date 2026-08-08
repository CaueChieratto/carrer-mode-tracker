import { ChartDataPoint } from "../../types";
import Styles from "./ChartSvg.module.css";

interface ChartSvgProps {
  svgWidth: number;
  svgHeight: number;
  padding: { bottom: number };
  yAxisElements: { y: number; label: string | number }[];
  linePoints: string;
  chartData: ChartDataPoint[];
  activeTooltip: number | null;
  getX: (index: number) => number;
  getY: (val: string | number) => number;
  onPointClick: (index: number | null) => void;
}

export const ChartSvg = ({
  svgWidth,
  svgHeight,
  padding,
  yAxisElements,
  linePoints,
  chartData,
  activeTooltip,
  getX,
  getY,
  onPointClick,
}: ChartSvgProps) => {
  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={Styles.chartSvg}>
      {yAxisElements.map((el, idx) => (
        <g key={`grid-${idx}`}>
          <line
            x1={10}
            y1={el.y}
            x2={svgWidth}
            y2={el.y}
            className={Styles.gridLine}
          />
          <text x={10} y={el.y - 6} className={Styles.yAxisLabel}>
            {el.label}
          </text>
        </g>
      ))}
      <polyline points={linePoints} className={Styles.dataLine} />
      {chartData.map((d, i) => {
        const cx = getX(i);
        const cy = getY(d.value);
        const isSelected = activeTooltip === i;

        return (
          <g key={`point-${i}`}>
            <line
              x1={cx}
              y1={cy}
              x2={cx}
              y2={svgHeight - padding.bottom + 10}
              className={Styles.verticalGridLine}
            />
            <text
              x={cx}
              y={svgHeight - 15}
              className={Styles.xAxisLabel}
              style={{ textAnchor: "middle" }}
            >
              {d.label}
            </text>
            <circle
              cx={cx}
              cy={cy}
              r={isSelected ? "8" : "5"}
              className={`${Styles.dataPoint} ${
                isSelected ? Styles.activePoint : ""
              }`}
            />
            {isSelected && (
              <circle cx={cx} cy={cy} r="14" className={Styles.activeRing} />
            )}
            <circle
              cx={cx}
              cy={cy}
              r="30"
              fill="transparent"
              className={Styles.touchTarget}
              onClick={(e) => {
                e.stopPropagation();
                onPointClick(isSelected ? null : i);
              }}
            />
          </g>
        );
      })}
    </svg>
  );
};
