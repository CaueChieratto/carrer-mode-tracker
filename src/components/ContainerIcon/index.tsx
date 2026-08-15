import { CSSProperties, MouseEvent, ReactNode } from "react";
import Styles from "./ContainerIcon.module.css";
import classNames from "classnames";

type ContainerIconProps = {
  children: ReactNode;
  className?: string;
  color?: "default" | "black";
  onClick?: () => void;
  onClickEvent?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
};

const ContainerIcon = ({
  children,
  className,
  color = "default",
  style,
  onClick,
  onClickEvent,
}: ContainerIconProps) => {
  return (
    <div
      className={classNames(className ?? Styles.icon, Styles[color])}
      onClick={onClickEvent ?? onClick}
      style={style ?? undefined}
    >
      {children}
    </div>
  );
};

export default ContainerIcon;
