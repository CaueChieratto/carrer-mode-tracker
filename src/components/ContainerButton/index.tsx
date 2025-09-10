import { CSSProperties, ReactNode } from "react";
import Styles from "./ContainerButton.module.css";

type ContainerButtonProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const ContainerButton = ({
  children,
  className,
  style,
}: ContainerButtonProps) => {
  return (
    <div className={className ?? Styles.container_buttons} style={style}>
      {children}
    </div>
  );
};

export default ContainerButton;
