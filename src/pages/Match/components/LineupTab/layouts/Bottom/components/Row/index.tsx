import { ReactNode } from "react";
import Styles from "./Row.module.css";

type RowProps = {
  children: ReactNode;
  "data-slot-id"?: string;
};

export const Row = ({ children, "data-slot-id": dataSlotId }: RowProps) => {
  return (
    <div className={Styles.row} data-slot-id={dataSlotId}>
      {children}
    </div>
  );
};
