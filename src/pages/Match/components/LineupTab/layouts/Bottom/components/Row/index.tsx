import { ReactNode } from "react";
import Styles from "./Row.module.css";

type RowProps = {
  children: ReactNode;
};

export const Row = ({ children }: RowProps) => {
  return <div className={Styles.row}>{children}</div>;
};
