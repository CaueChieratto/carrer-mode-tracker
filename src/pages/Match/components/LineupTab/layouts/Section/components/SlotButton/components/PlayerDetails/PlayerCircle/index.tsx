import { ReactNode } from "react";
import Styles from "./PlayerCircle.module.css";

type PlayerCircleProps = {
  shirtNumber: number | string;
  children?: ReactNode;
};

export const PlayerCircle = ({ shirtNumber, children }: PlayerCircleProps) => {
  return (
    <div className={Styles.player_circle}>
      <span className={Styles.shirt_number_center}>{shirtNumber}</span>

      {children}
    </div>
  );
};
