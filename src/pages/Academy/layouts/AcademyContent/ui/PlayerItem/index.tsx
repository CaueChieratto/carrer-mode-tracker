import { ReactNode } from "react";
import Styles from "./PlayerItem.module.css";

type PlayerItemProps = {
  children: ReactNode;
};

export const PlayerItem = ({ children }: PlayerItemProps) => {
  return <div className={Styles.playerItem}>{children}</div>;
};
