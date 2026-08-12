import { ChartDataPoint } from "../../types";
import Styles from "./ChartTooltip.module.css";

interface ChartTooltipProps {
  data: ChartDataPoint;
  currentAttribute: string;
  onClose: () => void;
}

export const ChartTooltip = ({
  data,
  currentAttribute,
  onClose,
}: ChartTooltipProps) => {
  const getFormattedValue = () => {
    switch (currentAttribute) {
      case "overall":
        return `${data.value} OVR`;

      case "potential":
        return `${data.value} POT`;

      case "age":
        return `${data.value} anos`;

      case "height":
        return `${data.value} cm`;

      case "weight":
        return `${data.value} kg`;

      case "sector":
        return data.value;

      case "position":
        return data.value;

      default:
        return data.value;
    }
  };

  return (
    <div className={Styles.overlay} onClick={onClose}>
      <div className={Styles.modalCard}>
        <span className={Styles.ttTitle}>{data.title}</span>
        <span className={Styles.ttValue}>{getFormattedValue()}</span>
        <span className={Styles.ttDesc}>{data.desc}</span>
        <span className={Styles.ttDate}>{data.label}</span>
      </div>
    </div>
  );
};
