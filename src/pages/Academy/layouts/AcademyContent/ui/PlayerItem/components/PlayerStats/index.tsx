import { ElementType, ReactNode } from "react";
import Styles from "./PlayerStats.module.css";

type PlayerStatsProps = {
  stat?: number;
  icon?: ElementType;
  children?: ReactNode;
};

export const PlayerStats = ({
  icon: Icon,
  stat,
  children,
}: PlayerStatsProps) => {
  return (
    <div className={Styles.gridSlot}>
      {!children ? (
        <span className={Styles.statBadge}>
          {Icon && <Icon size={16} />}
          {stat !== undefined && stat}
        </span>
      ) : (
        children
      )}
    </div>
  );
};
