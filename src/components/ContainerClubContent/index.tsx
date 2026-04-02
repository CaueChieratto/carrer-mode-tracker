import { ReactNode } from "react";
import Styles from "./ContainerClubContent.module.css";

type ContainerClubContentProps = {
  children: ReactNode;
};

export const ContainerClubContent = ({
  children,
}: ContainerClubContentProps) => {
  return <div className={Styles.container}>{children}</div>;
};
