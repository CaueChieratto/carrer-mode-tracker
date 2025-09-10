import { CSSProperties, ReactNode } from "react";
import Styles from "./ContainerIcon.module.css";
import classNames from "classnames";

type ContainerIconProps = {
  children: ReactNode;
  className?: string;
  color?: "default" | "black";
  onClick?: () => void;
  style?: CSSProperties;
};

const ContainerIcon = ({
  children,
  className,
  color = "default",
  style,
  onClick,
}: ContainerIconProps) => {
  return (
    <div
      className={classNames(className ?? Styles.icon, Styles[color])}
      onClick={onClick}
      style={style ?? undefined}
    >
      {children}
    </div>
  );
};

export default ContainerIcon;
