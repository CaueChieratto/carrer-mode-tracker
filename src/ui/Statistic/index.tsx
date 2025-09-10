import { ReactNode } from "react";
import Styles from "./CalculatedStatistics.module.css";
import { UseRatingColor } from "../../common/hooks/Colors/GetOverallColor";

type StatisticProps = {
  label: string;
  icon: ReactNode;
  value: number | undefined;
  isLeague?: boolean;
  isInfo?: boolean;
  getColor?: boolean;
  className?: string;
  deleteIcon?: ReactNode;
  onClick?: () => void;
};

const Statistic = ({
  label,
  icon,
  value,
  isLeague,
  isInfo,
  getColor,
  className,
  deleteIcon,
  onClick,
}: StatisticProps) => {
  const divClass = isInfo ? Styles.icons : `${Styles.icons} ${className ?? ""}`;

  const divStyle =
    !isInfo && getColor && typeof value === "number"
      ? { backgroundColor: UseRatingColor(value) }
      : {};

  return (
    <div className={divClass} style={divStyle}>
      {deleteIcon ? (
        <span className={Styles.deleteIcon} onClick={onClick}>
          {deleteIcon}
        </span>
      ) : isInfo ? (
        <>
          <span className={Styles.hidden}>{label}</span>
          {icon}
        </>
      ) : (
        <span className={!isLeague ? Styles.stats : Styles.statsLeague}>
          {typeof value === "number" ? value : 0}
        </span>
      )}
    </div>
  );
};

export default Statistic;
