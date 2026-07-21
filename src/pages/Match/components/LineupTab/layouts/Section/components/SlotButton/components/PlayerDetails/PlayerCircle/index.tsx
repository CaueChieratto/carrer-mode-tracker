import { ReactNode } from "react";
import Styles from "./PlayerCircle.module.css";
import { MdPerson } from "react-icons/md";

type PlayerCircleProps = {
  shirtNumber: number | string | undefined;
  children?: ReactNode;
  isSquad?: boolean;
};

export const PlayerCircle = ({
  shirtNumber,
  children,
  isSquad,
}: PlayerCircleProps) => {
  return (
    <div
      className={isSquad ? Styles.player_circle_squad : Styles.player_circle}
    >
      {shirtNumber ? (
        <span className={Styles.shirt_number_center}>{shirtNumber}</span>
      ) : (
        <MdPerson className={Styles.player_icon} />
      )}

      {children}
    </div>
  );
};
