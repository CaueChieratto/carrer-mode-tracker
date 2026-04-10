import { ReactNode } from "react";
import Styles from "./NumberStats.module.css";

type NumberStatsProps = {
  children: ReactNode;
  type: "goals" | "assist" | "bench";
};

export const NumberStats = ({ children, type }: NumberStatsProps) => {
  return (
    <div
      className={
        type === "goals"
          ? Styles.goals
          : type === "assist"
            ? Styles.assist
            : Styles.bench
      }
    >
      {children}
    </div>
  );
};
