import { CSSProperties, ReactNode } from "react";
import Styles from "./ContainerForm.module.css";

type ContainerFormProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
};

const ContainerForm = ({ children, style, className }: ContainerFormProps) => {
  return (
    <div
      className={className ?? Styles.containerForm}
      style={style ?? undefined}
    >
      {children}
    </div>
  );
};

export default ContainerForm;
