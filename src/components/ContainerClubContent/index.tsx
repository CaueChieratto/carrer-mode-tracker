import { ReactNode } from "react";
import Styles from "./ContainerClubContent.module.css";

type ContainerClubContentProps = {
  children: ReactNode;
  isMatch?: boolean;
};

export const ContainerClubContent = ({
  children,
  isMatch,
}: ContainerClubContentProps) => {
  return (
    <div
      className={Styles.container}
      style={isMatch ? { gap: "24px" } : { gap: "12px" }}
    >
      {children}
    </div>
  );
};
