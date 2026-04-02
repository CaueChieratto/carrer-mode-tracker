import { ReactNode } from "react";
import Styles from "./ContainerTableTeam.module.css";

type ContainerTableTeamProps = {
  children: ReactNode;
  columns: number;
};

export const ContainerTableTeam = ({
  children,
  columns,
}: ContainerTableTeamProps) => {
  return (
    <div
      className={Styles.container_tabela}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
};
