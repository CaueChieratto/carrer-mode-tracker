import { ReactNode } from "react";
import Styles from "./PrimaryHeader.module.css";

type PrimaryHeaderProps = {
  children?: ReactNode;
  invert?: boolean;
  text: string;
};

const PrimaryHeader = ({ children, text, invert }: PrimaryHeaderProps) => {
  return (
    <header className={!invert ? Styles.header : Styles.invert}>
      <h2 className={Styles.h2}>{text}</h2>
      {children}
    </header>
  );
};

export default PrimaryHeader;
