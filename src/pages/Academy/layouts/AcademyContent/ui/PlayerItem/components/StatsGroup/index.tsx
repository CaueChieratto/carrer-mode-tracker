import { ReactNode } from "react";
import Styles from "./StatsGroup.module.css";

type StatsGroupProps = {
  children: ReactNode;
};

export const StatsGroup = ({ children }: StatsGroupProps) => {
  return <div className={Styles.statsGroup}>{children}</div>;
};
