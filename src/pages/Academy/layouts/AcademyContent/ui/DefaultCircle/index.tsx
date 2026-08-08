import { ReactNode } from "react";
import classNames from "classnames";
import Styles from "./DefaultCircle.module.css";

type DefaultCircleProps = {
  children: ReactNode;
  isActive?: boolean;
};

export const DefaultCircle = ({
  children,
  isActive = false,
}: DefaultCircleProps) => {
  return (
    <div
      className={classNames(Styles.defaultCircle, {
        [Styles.active]: isActive,
      })}
    >
      {children}
    </div>
  );
};
